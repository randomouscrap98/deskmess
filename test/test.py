import os
import shutil
import subprocess
# import argparse
# import re

print("Setting up modified index.html")

# First, we create a basic index.html out of the original index.html
# and the test.js harness.
with open(os.path.join("..", "index.html"), 'r', encoding='utf-8') as f:
    template_content = f.read()

with open("test.js", 'r', encoding='utf-8') as f:
    insert_content = f.read()

modified_content = template_content.replace(
    '// !! INSERT TEST HARNESS HERE !!', insert_content)

with open("index.html", 'w', encoding='utf-8') as f:
    f.write(modified_content)

# Next, copy the server python file here and remove the test note
# dir (if it exists)
print("Setting up server environment")
shutil.copy(os.path.join("..", "server.py"), "server.py")
shutil.rmtree("notes", ignore_errors=True)

print("Hosting test page")
subprocess.run(["python3", "server.py", "--port",
               "60004", "--address", "localhost", "--folder", "notes"])
