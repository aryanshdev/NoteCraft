import subprocess
import os

def handler(event, context):
    language = event.get('language')
    code = event.get('code')

    if not language or not code:
        return {'error': 'Missing language or code in the event'}

    if language == 'python':
        try:
            exec_globals = {}
            exec(code, exec_globals)
            result = exec_globals.get('result', 'No result variable found.')
        except Exception as e:
            result = str(e)

    elif language == 'java':
        with open('/tmp/Main.java', 'w') as f:
            f.write(code)
        compile_proc = subprocess.run(['javac', '/tmp/Main.java'], capture_output=True, text=True)
        if compile_proc.returncode != 0:
            return {"error": compile_proc.stderr}
        run_proc = subprocess.run(['java', '-cp', '/tmp', 'Main'], capture_output=True, text=True)
        result = run_proc.stdout if run_proc.returncode == 0 else run_proc.stderr

    elif language in ['c', 'cpp']:
        source_file = '/tmp/main.c' if language == 'c' else '/tmp/main.cpp'
        output_exe = '/tmp/main'
        with open(source_file, 'w') as f:
            f.write(code)
        compiler = 'gcc' if language == 'c' else 'g++'
        compile_proc = subprocess.run([compiler, source_file, '-o', output_exe], capture_output=True, text=True)
        if compile_proc.returncode != 0:
            return {"error": compile_proc.stderr}
        run_proc = subprocess.run([output_exe], capture_output=True, text=True)
        result = run_proc.stdout if run_proc.returncode == 0 else run_proc.stderr

    else:
        result = "Unsupported language. Please use 'python', 'java', 'c', or 'cpp'."

    return {"result": result}
