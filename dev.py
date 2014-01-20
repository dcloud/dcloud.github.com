#!/usr/bin/env python

try:
    from livereload import Server, shell
except Exception, e:
    print('Script requires python-livereload.')
    raise e

import os.path


def main():
    server = Server()

    watchdir = os.path.abspath('.')

    # run a shell command
    server.watch(watchdir)

    server.serve(8888)

if __name__ == '__main__':
    main()
