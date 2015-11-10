# Why?

Note: Why did we chose the tools we did?


## Why Open edX?
- Openness and community
- Technology
- Extensibility

Note: We wanted to build our product around an open platform, so we shopped
around for open source LMSs.  Open source is not everything, however.  Coming
from a background of open source consulting, we know that having the code out
there is not enough.  For an open source project to be useful, it has to be
**alive**.  In other words, it requires leadership that embraces a community of
both developers and users.

Open edX certainly qualifies as a living project, but how hard is it to grok,
as developers and sysadmins?  Surprisingly, not very hard at all!  The choice
of Python for deployment (via Ansible YAML) and development (of the core
LMS/CMS, at least, via Django) was a huge plus, in particular for OpenStack
contributors such as ourselves.  

Even before initial investigation, we were pretty sure that no LMS would do
what we wanted out of the box.  (And that's not a bad thing, since we went in
with the desire to contribute something new!)  So we needed an LMS that was
easily expandable.  Another plus for Open edX!

And last but not least... how awesome would it be to work with the latest,
greatest, and coolest open source LMS out there?


## Why OpenStack?
- Openness and community
- Technology
- Extensibility

Note: Can you see the pattern, here?  OpenStack is:

- Also open, one of our requirements, and also very much alive, with a very
  vibrant community around of the biggest, most successful open source cloud
  technologies that currently exist

- Also built on easy-to-read, easy-to-understand Python (and YAML, via Heat
  templates)

- Also, and by definition, extensible and "automatable" from the bottom to the
  top (as any cloud platform should!)

- Also the cool kid on the block, as far as cloud platforms go

It didn't take long for us, OpenStack consultants and trainers, to
recognize that Open edX was the perfect complement to our consulting and
training expertise.  As you'll see, the union proved itself to be (well,
almost) perfect for our needs, the proof of which is that we were able to come
up with a product MVP in under six months.
