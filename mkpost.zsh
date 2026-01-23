#!/usr/bin/env zsh

# Create a new blog post, e.g.: `today=$(date -I); echo "+++\ntitle: \ndate: $today\n+++" >> content/blog/${today}-title.md`
local blog_date=$(date -I)
read 'title?title: '
local slug="${${(L)title//[[:punct:]]/}//[[:space:]]/-}"
local filename="content/blog/$blog_date-$slug.md"
content_tpl="+++\ntitle: $title\ndate: $blog_date\n+++"

echo
echo "slug: $slug"
echo "filename: $filename"
# echo $content_tpl
echo $content_tpl >> content/blog/${blog_date}-$title.md
