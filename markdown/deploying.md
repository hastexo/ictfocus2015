Deploying
## Open edX
on
## OpenStack

Note: Our first job was to find a way to deploy edX on OpenStack.  First, on a
single node, and then, on a highly-available, scalable manner to a cluster of
VMs.


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


Writing the
## Heat template


- 1 security group
- 1 private network with a router
- 2 cloud-configs (deploy and backend/app)
- 1 deploy node with a public IP
- 1 load balancer with a public IP
- 3 backend servers
- X app servers in a pool
- Parameters: Key, public network, VM sizes, and number of app servers
- Outputs: Public IPs

Note: After figuring out how to use the Ansible roles in edx/configuration, we
forged ahead with writing the Heat template that would create the actual nodes
in the cluster.

What you see in the slide is the shopping list of so-called "resources" that
the Heat template creates, as well as a list of parameters one can pass into
the template at stack creation time.

The idea is that this template can be used in any public or private OpenStack
cloud that supports Heat and LBaaS, with no modifications!
