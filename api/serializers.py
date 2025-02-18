from rest_framework import serializers
from .models import MyUser, Hobby

class HobbySerializer(serializers.ModelSerializer):
    class Meta:
        model = Hobby
        fields = '__all__'
    
class MyUserSerializer(serializers.ModelSerializer):
    hobbies = HobbySerializer(many=True)
    
    class Meta:
        model = MyUser
        fields = '__all__'
        
    def update(self, instance, validated_data):
        # Extract hobbies data
        hobbies_data = validated_data.pop('hobbies', [])

        # Update simple fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Handle nested hobbies
        current_hobbies = {hobby.id: hobby for hobby in instance.hobbies.all()}
        new_hobby_ids = [hobby_data.get('id') for hobby_data in hobbies_data if 'id' in hobby_data]

        # Remove hobbies not in the new list
        for hobby_id in list(current_hobbies.keys()):
            if hobby_id not in new_hobby_ids:
                instance.hobbies.remove(current_hobbies[hobby_id])

        # Add or update hobbies
        for hobby_data in hobbies_data:
            hobby_id = hobby_data.get('id')
            if hobby_id and hobby_id in current_hobbies:
                hobby = current_hobbies[hobby_id]
                hobby.name = hobby_data.get('name', hobby.name)
                hobby.description = hobby_data.get('description', hobby.description)
                hobby.save()
            else:
                # Create new hobby and associate it with the user
                hobby = Hobby.objects.create(**hobby_data)
                instance.hobbies.add(hobby)

        return instance