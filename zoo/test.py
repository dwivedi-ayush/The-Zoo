import subprocess
import multiprocessing
import time

def worker(stop_event):
    while not stop_event.is_set():
        print("Working...")
        time.sleep(1)

if __name__ == "__main__":
    num_processes = multiprocessing.cpu_count()
    processes = []

    for i in range(num_processes):
        command = ["xterm", "-e", "python", "-c", f"from __main__ import worker; worker(multiprocessing.Event())"]
        p = subprocess.Popen(command)
        processes.append(p)

    try:
        input("Press Enter to stop the processes...")
    except KeyboardInterrupt:
        print("\nInterrupted by user.")

    for p in processes:
        p.terminate()
