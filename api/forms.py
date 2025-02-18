from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import MyUser, Hobby

class UserCreationForm(UserCreationForm):
    """ adding fields for registration"""
    # Additional fields for registration
    name = forms.CharField(max_length=255, required=True)
    date_of_birth = forms.DateField(required=True, widget=forms.SelectDateWidget(years=range(1900, 2025)))

    class Meta:
        model = MyUser
        fields = ['email', 'name', 'date_of_birth', 'password1', 'password2']

class UserProfileForm(forms.ModelForm):
    """ adding hobbies to updating profile"""
    hobbies = forms.ModelMultipleChoiceField(queryset=Hobby.objects.all(), required=False, widget=forms.CheckboxSelectMultiple)

    class Meta:
        model = MyUser
        fields = ['name', 'date_of_birth', 'hobbies']
        widgets = {
            'date_of_birth': forms.SelectDateWidget(years=range(1900, 2025)),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['hobbies'].queryset = Hobby.objects.all()