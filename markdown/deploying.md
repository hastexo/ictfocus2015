Deploying
## Open edX
on
## OpenStack

Note: Our first job was to find a way to deploy edX on OpenStack.  First, on a
single node, and then, on a highly-available, scalable manner to a cluster of
VMs.


Single node?
## Easy!

- Port util/install/sandbox.sh to cloud-config <!-- .element: class="fragment" -->
- Use edx_sandbox.yml playbook as a template. <!-- .element: class="fragment" -->

Note:  Installing Open edX on a single OpenStack VM was relatively easy.  We
whipped up a basic Heat template to use an Ubuntu 12.04 image, ported the
pre-requisite installation steps from
*edx/configuration/util/install/sandbox.sh* into a cloud-init script, and off
we went.


Single node
## VM Requirements?

- 8GB of RAM <!-- .element: class="fragment" -->

Note: The only ceiling we ran into, at first, was RAM usage.  All Open edX's
services on a single node require quite a bit of RAM: we found out 4GB is just
not enough.


Multi-node?
## Not so easy.

Note:  Desiging a scalable Open edX cluster without any previous experience
wasn't as easy.


### How
is Open edX
### deployed
on edx.org?

[Feanil Patel's talk](https://www.youtube.com/watch?v=ITMwNto82eE) <!-- .element: class="fragment" -->

Note: Our first idea was to try and find out how edX was deployed on edx.org.
We were lucky, because not only had Feanil Patel given a talk on this very
subject last year, it had been recorded and posted online.


<!-- .slide: data-background-image="images/cluster.svg" data-background-size="contain" -->

Note: This is how we designed our OpenStack cluster:

- A small deploy node is instantiated, for the single purpose of orchestrating
  Ansible playbook runs onto all other nodes.  edx/configuration will be
  checked out there, and pre-requisites installed.

- Exactly three backend nodes are created.  This is the minimal possible number
  of Galera nodes, and more than enough for Mongo replication.  The mariadb and
  mongodb edx/configuration roles will be assigned to them.

- An arbitrary number of app servers are launched, where a copy of everything
  from RabbitMQ, the CMS, and the LMS, to the forum and workers will run.

- An OpenStack load balancer (as provided by LBaaS) directs requests from end
  users to the app servers.

It is far from perfect, but we believe it is good enough for medium
deployments.


Can we use the
### AWS playbooks
from edx/configuration?

- No. <!-- .element: class="fragment" -->
- (Sorry, removed on Cypress!) <!-- .element: class="fragment" -->

Note: While Feanil's talk was very enlightening, it didn't provide any
technical details as to how exactly to write a playbook for a cluster.  Also,
we soon discovered that the sample AWS cloud formation templates were not a
good source of information, as they were mostly unused and unmaintained.

(So much so, they were removed entirely from edx/configuration for the Cypress
release.)


How about
### vagrant-cluster.yml?

- YES! <!-- .element: class="fragment" -->

Note: *vagrant-cluster.yml* is a sample playbook included in
*edx/configuration* for simulating a three-node cluster.  It was very useful in
elucidating how to use the different roles in a clustered manner, particularly
as to what variables to set, and how.


What
## variables?

Note: Next, we needed to figure out how to use the various Ansible playbook
variables to get the cluster working.  It's a different set for the backend and
app nodes.


Variables for the
### backend nodes

- MONGO_CLUSTERED: yes <!-- .element: class="fragment" -->
- ELASTICSEARCH_CLUSTERED: yes <!-- .element: class="fragment" -->
- MARIADB_CLUSTERED: yes <!-- .element: class="fragment" -->


Variables for the
### app servers

- EDXAPP_MYSQL_HOST: "{{ groups['backend_servers'][0] }}" <!-- .element: class="fragment" -->
- XQUEUE_MYSQL_HOST: "{{ groups['backend_servers'][0] }}" <!-- .element: class="fragment" -->
- EDX_NOTES_API_MYSQL_HOST: "{{ groups['backend_servers'][0] }}" <!-- .element: class="fragment" -->
- EDXAPP_MONGO_HOSTS: "{{ groups['backend_servers'] }}" <!-- .element: class="fragment" -->
- FORUM_MONGO_HOSTS: "{{ groups['backend_servers'] }}" <!-- .element: class="fragment" -->

Note: These are just a few examples.  There are more variables needed, and
examples for each can be found in
*edx-configuration/playbooks/openstack/group_vars*.


Writing the
## Heat template

- 1 security group <!-- .element: class="fragment" -->
- 1 private network with a router <!-- .element: class="fragment" -->
- 2 cloud-configs (deploy and backend/app) <!-- .element: class="fragment" -->
- 1 deploy node with a public IP <!-- .element: class="fragment" -->
- 1 load balancer with a public IP <!-- .element: class="fragment" -->
- 3 backend servers <!-- .element: class="fragment" -->
- X app servers in a pool <!-- .element: class="fragment" -->
- Parameters: Key, public network, VM sizes, and number of app servers <!-- .element: class="fragment" -->
- Outputs: Public IPs <!-- .element: class="fragment" -->

Note: After figuring out how to use the Ansible roles in edx/configuration, we
forged ahead with writing the Heat template that would create the actual nodes
in the cluster.

What you see in the slide is the shopping list of so-called "resources" that
the Heat template creates, as well as a list of parameters one can pass into
the template at stack creation time.

The idea is that this template can be used in any public or private OpenStack
cloud that supports Heat and LBaaS, with no modifications!


The
## Inventory
Generator

[169.254.169.254/openstack/latest/meta_data.json]() <!-- .element: class="fragment" -->

Note: Problem: if the number of app servers is set at stack creation time, how
do we get a list of their IP addresses, and how can we pass that to Ansible
automatically, so that the proper roles can be deployed?

This is what Ansible dynamic inventory generators are for.  Luckily, it is
possible to specify arbitrary metadata in the Heat template for a given
OpenStack VM, in such a way that a simple HTTP request to a fixed URL, from
that particular VM, will get you that data.

It is **also** possible to insert the list of currently running app server IP
addresses in there, so this gives us a way to automate playbook runs, even if
the number of app servers is increased (or decreased).


## Let's try it!

Note: Enough theory.  Let's try it in practice!


<!-- .slide: data-background-iframe="http://localhost:4200/" data-background-size="contain" -->

Note:  Here we'll fire up a multi-node edX installation on OpenStack.

- heat stack-create -f heat-templates/hot/edx-multi-node.yaml -P "public_net_id=62954df1-05bb-42e5-9960-ca921cccaeeb;app_count=1;key_name=adolfo" openedx2015
- watch -n 15 heat stack-list
- heat output-show openedx2015 --all
- ssh -A ubuntu@[deploy_ip]
- curl -s http://169.254.169.254/openstack/latest/meta_data.json | python -mjson.tool
- exit
- heat stack-update -f heat-templates/hot/edx-multi-node.yaml -P "public_net_id=62954df1-05bb-42e5-9960-ca921cccaeeb;app_count=2;key_name=adolfo" openedx2015
- watch -n 15 heat stack-list
- ssh -A ubuntu@[deploy_ip]
- curl -s http://169.254.169.254/openstack/latest/meta_data.json | python -mjson.tool
- ssh-keygen -t rsa
- for i in 111 112 113 202 203; do j=192.168.122.$i; ssh-keyscan $j >> ~/.ssh/known_hosts; ssh-copy-id -i ~/.ssh/id_rsa $j; done
- exit
- ssh ubuntu@[deploy_ip]
- ssh-add -L
- git clone -b integration/cypress https://github.com/hastexo/edx-configuration.git
- cd edx-configuration/playbooks/openstack/group_vars
- for i in all backend_servers app_servers; do cp $i.example $i; done
- cd ../../
- ansible-playbook -i openstack/inventory.py openstack-multi-node.yml 
- heat output-show openedx2015-pre --all
- vim /etc/hosts:
  [app_ip] lms.example.com studio.example.com
- https://lms.example.com
