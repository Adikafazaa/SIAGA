import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

path = r'C:\Users\Adika\.gemini\antigravity-cli\brain\f9800647-25d7-4fb2-85a3-9ceca4e81364\.system_generated\logs\transcript.jsonl'
with open(path, 'r', encoding='utf-8') as f:
    for line in f:
        d = json.loads(line)
        t = d.get('created_at', '')
        if 'T18:' in t or 'T17:' in t or 'T19:' in t:
            print(f"Step {d.get('step_index')} [{t}] {d.get('source')} {d.get('type')}")
            for c in d.get('tool_calls', []):
                print('  Call:', c.get('name'), str(c.get('args'))[:120])
            if d.get('type') == 'USER_INPUT':
                print('  User content:', d.get('content')[:120])
