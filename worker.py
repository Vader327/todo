import sys
import datetime

data = sys.stdin.readlines()[0].rstrip()
#data = "helloT10:49:0.0"

while True:
  current = str(datetime.datetime.now().time()).split(":")
  current.pop()
  current[0] = int(current[0])*60*60
  current[1] = int(current[1])*60
  current_secs = current[0] + current[1]

  times = data.split('T')[1].split(":")
  times.pop()
  times[0] = int(times[0])*60*60
  times[1] = int(times[1])*60
  secs = times[0] + times[1]

  if current_secs == secs:
    print("Now")
    break
