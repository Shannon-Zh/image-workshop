import json, os

files = []
for root, dirs, filenames in os.walk('.'):
    dirs[:] = [d for d in dirs if d not in ('node_modules', 'dist')]
    for fn in filenames:
        fp = os.path.join(root, fn)
        fp_normalized = fp.replace(os.sep, '/')
        if fn.endswith(('.ts', '.tsx', '.css', '.html', '.json', '.svg')):
            with open(fp, encoding='utf-8', errors='replace') as f:
                content = f.read()
            path = fp_normalized[2:] if fp_normalized.startswith('./') else fp_normalized
            files.append({'path': path, 'content': content})

files.append({'path': '.gitignore', 'content': 'node_modules/\ndist/\n.env\n*.local\n'})
print(f'Total: {len(files)} files')

with open('C:/Users/dckj111/AppData/Local/Temp/push_files.json', 'w', encoding='utf-8') as f:
    json.dump(files, f, ensure_ascii=False)
