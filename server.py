#!/usr/bin/env python3

from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, unquote
import os
import argparse
import re


def parse_slug(uri):
    slug = unquote(urlparse(uri).path).lstrip('/')
    if slug and not re.match(r'^[\w-]+$', slug):
        raise ValueError("Invalid path")
    return slug


class SimpleServer(BaseHTTPRequestHandler):
    def handle_exceptions(self, func):
        try:
            func()
        except ValueError as e:
            self.send_error(400, "Bad request: " + str(e))
        except FileNotFoundError:
            self.send_error(404, "File not found")
        except Exception as e:
            self.send_error(500, "Internal Server Error: " + str(e))

    def send_success(self, content, type):
        self.send_response(200)
        self.send_header('Content-type', type)
        self.end_headers()
        self.wfile.write(content)

    def get(self):
        global args
        slug = parse_slug(self.path)
        if not slug:
            with open("index.html", 'rb') as f:
                self.send_success(f.read(), 'text/html; charset=utf-8')
                return
        fpath = os.path.join(args.folder, slug)
        if not os.path.exists(fpath) or not os.path.isfile(fpath):
            raise FileNotFoundError("No such file: " + fpath)
        with open(fpath, 'rb') as f:
            self.send_success(f.read(), 'text-plain; charset=utf-8')

    def post(self):
        global args
        slug = parse_slug(self.path)
        fpath = os.path.join(args.folder, slug)
        content_length = int(self.headers.get('Content-Length', 0))
        content = self.rfile.read(content_length)
        with open(fpath, 'wb') as f:
            f.write(content)
        self.send_success(b'{"success":true}',
                          'application/json; charset=utf-8')

    def do_GET(self):
        self.handle_exceptions(self.get)

    def do_POST(self):
        self.handle_exceptions(self.post)

    def end_headers(self):
        # Add CORS headers
        global args
        if 'cors_origin' in args and args.cors_origin:
            self.send_header('Access-Control-Allow-Origin', args.cors_origin)
        super().end_headers()


def main():

    parser = argparse.ArgumentParser(description="A simple HTTP server")
    parser.add_argument('--port', type=int, default=60003,
                        help='Port to listen on')
    parser.add_argument('--address', type=str, default='localhost',
                        help='Address to bind to')
    parser.add_argument('--cors_origin', type=str, default='*',
                        help='CORS origin')
    parser.add_argument('--folder', type=str, default='notes',
                        help='Folder to store files')

    global args
    args = parser.parse_args()

    if not os.path.exists(args.folder):
        os.makedirs(args.folder)

    httpd = HTTPServer((args.address, args.port), SimpleServer)
    print("Serving at http://" + args.address + ":" + str(args.port))
    httpd.serve_forever()


if __name__ == '__main__':
    main()
