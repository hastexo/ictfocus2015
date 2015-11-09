Learning
## OpenStack
on
## Open edX

Note: Alright, we have a highly-available, scalable Open edX cluster to play
with.  How about using it to teach OpenStack itself?


A
## cluster
to
## play with

Note: Here's what we think is missing from the world of technology training:
affordable self-paced courses that give the trainee an easy way to practice the
theory of cluster deployment and maintenance.


## $$$!

Note: Part of the problem is that giving each and every trainee their own
cluster, even if it's just composed of VMs, would be very expensive.


## Heat
to the rescue!

- A Heat stack for each student... <!-- .element: class="fragment" -->
- ... suspended when not in use. <!-- .element: class="fragment" -->

Note: The solution we came up with is to fire a Heat stack for every student,
but then suspend it if it's not in use.  When the trainee comes back, of
course, the stack is resumed automatically.


Enter
## XBlocks!

https://github.com/hastexo/hastexo-xblock <!-- .element: class="fragment" -->

Note: As noted before, one of the reasons we chose Open edX was because it was
extensible.  And XBlocks were the extension API that seemed most suited to
implement our solution: it offered enough flexibility to implement the needed
features, and also an easy way to keep them customizable at the hands of course
authors.

In other words, with an XBlock we can let the course author define the Heat
stack for a particular run, then fire it up for every trainee as needed.


### OpenStack auth

```
<vertical url_name="lab_introduction">
  <hastexo
    url_name="lab_introduction"
    stack_template_path="hot_lab.yaml"
    stack_user_name="training"
    os_auth_url="https://ops.elastx.net:5000/v2.0"
    os_tenant_name="example.com"
    os_username="demo@example.com"
    os_password="foobarfoobarfoofoo" />
</vertical>
```

Note: This is how a course author invokes the hastexo XBlock, using OLX.  Here
you can see the standard OpenStack authentication variables, and also the asset
file name of the Heat template that should be uploaded to the data store.  The
user name that will be used to connect to the stack via SSH should also be
defined here, and match what the Heat template creates.


### Heat template outputs

```
outputs:
  public_ip:
    description: Floating IP address of deploy in public network
    value: { get_attr: [ deploy_floating_ip, floating_ip_address ] }
  private_key:
    description: Training private key
    value: { get_attr: [ training_key, private_key ] }
```


It's just
## Python, right?

- Accesses the data store directly <!-- .element: class="fragment" -->
- Uses the LMS's workers <!-- .element: class="fragment" -->

Note: We wanted an easy way for course authors to upload their Heat template,
and at least for now, that means uploading it to the course's data store, from
which the XBlock will fetch it directly.

Firing up a Heat stack takes a while, so we needed a way to do this
assynchronously... and the LMS's workers were *right there*!  So instead
of installing a whole other task queue, we went with Celery. though it requires
adding the hastexo-xblock to the LMS's installed apps.


Connecting the
## browser
to the
## lab environment

... with GateOne! <!-- .element: class="fragment" -->

Note: The last piece of the puzzle was finding a way to connect the course
content, as displayed on a student's browser, to the lab environment that would
be created just for them.

The solution we found was GateOne, a open source, Python and Javascript
terminal emulator and SSH client.  When run on the same app server as the LMS
hosting the XBlock, it allowed us to create an SSH connection securely
and automatically to the student's cluster.


## Bells
and
## Whistles

- A role to deploy the XBlock <!-- .element: class="fragment" -->
- A role to deploy courses from git <!-- .element: class="fragment" -->

Note: In developing all this, we also came up with a couple of helper roles.
One to deploy our XBlock properly, including dependencies, adding it to the
LMS's installed apps, and configuring the nginx reverse proxy.  The other, to
deploy courses from git.

Let's see it all in action!


<!-- .slide: data-background-iframe="http://localhost:4200/" data-background-size="contain" -->

Note: We'll now deploy the hastexo XBlock and a demo course.

- heat output-show openedx2015 --all
- ssh -A ubuntu@[deploy_ip]
- cd edx-configuration/playbooks
- ansible-playbook -i openstack/inventory.py hastexo_xblock.yml \
  -e hastexo_xblock_repo=https://github.com/hastexo/hastexo-xblock.git \
  --tags edxapp_cfg \
  --limit app_servers
- ansible-playbook -i openstack/inventory.py run_role.yml \
  -e role=git_add_course \
  -e git_add_course_repo=git@github.com:hastexo/hx112-edx.git \
  -e git_add_course_version=openedx2015 \
  -e git_add_course_checkout_name=hx112-edx \
  --limit app_servers
