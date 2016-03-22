'''Serializers convert the db queries into python
data structures(dictionaries) for easy json rendering'''
from rest_framework import serializers
from dietplans.models import DietPlan

class DietPlanSerializer(serializers.ModelSerializer):
	'''Serializer to convert the recieved data into suitable python dict'''
	class Meta:
		'''Meta data, or config for the serializer'''
		model = DietPlan
		exclude = ('id', 'creator', )

	def create(self, validated_data):
		'''creates object as soon as serializer.save
		is called if object doesnot already exists'''
		return DietPlan.objects.create(**validated_data)

	def update(self, instance, validated_data):
		'''updates the existing dietplan'''
		instance.name = validated_data.get('name', instance.name)
		instance.goal = validated_data.get('goal', instance.goal)
		instance.duration = validated_data.get('duration', instance.duration)
		instance.gender = validated_data.get('gender', instance.gender)
		instance.age = validated_data.get('age', instance.age)
		instance.height = validated_data.get('height', instance.height)
		instance.weight = validated_data.get('weight', instance.weight)
		instance.description = validated_data.get(
		                        'description', instance.description)
		instance.save()
		return instance



