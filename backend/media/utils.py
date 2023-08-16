import os
import cv2
import numpy as np

def object_detection_coco(img):
    thres = 0.5
    img = cv2.imread(img)

    coco_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'media/object_detection_models/coco/coco.names')
    with open(coco_path, 'r') as f:
        lines = f.readlines()
    classNames = [line.strip().split(', ') for line in lines]

    configPath = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'media/object_detection_models/coco/ssd_mobilenet_v3_large_coco_2020_01_14.pbtxt')
    weightsPath = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'media/object_detection_models/coco/frozen_inference_graph.pb')

    net = cv2.dnn_DetectionModel(weightsPath,configPath)
    net.setInputSize(320,320)
    net.setInputScale(1.0/ 127.5)
    net.setInputMean((127.5, 127.5, 127.5))
    net.setInputSwapRB(True)

    classIds, confs, bbox = net.detect(img,confThreshold=thres)
    objects = []
    for i in classIds:
        objects.extend(classNames[i-1])
    objects = list(set(objects))
    return objects
