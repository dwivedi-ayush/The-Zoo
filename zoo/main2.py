import time
def start(a,personality_id,test_mode,loop_limit,action_frequency=1):
    a=3
    while(a>0):
        # if stop_event.is_set():
        #     print(f"{personality_id} ending")
        #     break
        a-=1
        print(f"{personality_id} running...")
        time.sleep(1)
        

