## OpenStack for Open edX:
## Inside and Out

[`adolfo.brandes@hastexo.com`](mailto:adolfo.brandes@hastexo.com)

[@arbrandes](https://twitter.com/arbrandes) | [@hastexo](https://twitter.com/hastexo)


What is this
# about?

Note: You want a highly-available, scalable LMS deployment for, potentially,
thousands of students. You developed course material on clusters and distributed
computing in general, so you want each and every one of your students to have
an equally distributed environment to play with, and of course, to break at
will.  As icing on the cake, you want to deploy on OpenStack.

How do you build all this so that it doesn't cost a fortune for you to maintain
a course run, and for students to join in?

Here you'll see what we came up with to answer that question, using OpenStack
and, of course, Open edX.


You should
# know OpenStack

Note: This talks assumes a little familiarity with OpenStack.  We'll focus on
OpenStack Heat and its YAML template language.

If you don't know it, don't worry.  OpenStack is extensively documented, and
most of what will be covered here can be easily gleaned online.


You should
# know Ansible

Note: We also assume you know what we're talking about when we mention roles
and playbooks.  In particular, the roles and playbooks in edx/configuration.

(In other words, you'll get the most out of this if you've deployed Open edX at
least once.)


You should
# know XBlocks

Note: We'll talk about an XBlock, so a big part of what we'll cover assumes at
least passing knowledge of what XBlocks are and, ideally, how they work under
the hood.
