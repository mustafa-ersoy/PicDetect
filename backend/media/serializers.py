from rest_framework import serializers
from core.models import Image
from .utils import object_detection_coco
import os
import tempfile

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['id', 'image', 'file_size', 'name', 'tags']
        
    def create(self, validated_data):
        image_file = validated_data['image']
        file_size = image_file.size
        file_name = image_file.name

        with tempfile.TemporaryDirectory() as temp_dir:
        # Create a temporary file path within the temporary directory
            temp_image_path = os.path.join(temp_dir, 'uploaded_image.png')

        # Write the uploaded image content to the temporary file to be able to perform object detection.
            with open(temp_image_path, 'wb') as temp_image_file:
                temp_image_file.write(image_file.read())

            detected_objects = object_detection_coco(temp_image_path)

            image_instance = Image(
                file_size=file_size,
                name=file_name,
                tags=detected_objects,
                **validated_data
            )

            image_instance.save()
            return image_instance
