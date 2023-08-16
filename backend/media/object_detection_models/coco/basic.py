import cv2
thres = 0.55 # Threshold to detect object

img = cv2.imread('images/animals.jpeg')


classNames= []
with open('coco.names','rt') as f:
    classNames = f.read().rstrip('\n').split('\n')

configPath = 'ssd_mobilenet_v3_large_coco_2020_01_14.pbtxt'
weightsPath = 'frozen_inference_graph.pb'

net = cv2.dnn_DetectionModel(weightsPath,configPath)
net.setInputSize(320,320)
net.setInputScale(1.0/ 127.5)
net.setInputMean((127.5, 127.5, 127.5))
net.setInputSwapRB(True)

classIds, confs, bbox = net.detect(img,confThreshold=thres)

print(classIds, confs, bbox)

cv2.imshow('Output', img)
cv2.waitKey(0)
