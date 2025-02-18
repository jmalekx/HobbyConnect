from django import forms
from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.core.exceptions import ValidationError
from api.models import MyUser, Hobby, FriendRequest, Friend


class UserCreationForm(forms.ModelForm):
    """Form for creating new users. Includes all the required
    fields, plus a repeated password."""
    
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Password confirmation', widget=forms.PasswordInput)
    
    class Meta:
        model = MyUser
        fields = ['email', 'date_of_birth']
        
    def clean_password2(self):
        # Check that the two password entries match 
        password1 = self.cleaned_data.get('password1')
        password2 = self.cleaned_data.get('password2')
        
        if password1 and password2 and password1 != password2:
            raise ValidationError("Passwords don't match")
        
        return password2
    
    def save(self, commit=True):
        # Save the provided password in hashed format
        user = super().save(commit=False)
        user.set_password(self.cleaned_data['password1'])
        
        if commit:
            user.save()
        
        return user
    
class UserChangeForm(forms.ModelForm):
    """Form for updating users. Includes all the fields on
    the user, but replaces the password field with admin's
    disabled password hash display field.
    """
    
    password = ReadOnlyPasswordHashField()
    
    class Meta:
        model = MyUser
        fields = ['email', 'password', 'date_of_birth', 'is_active', 'is_admin','name', 'hobbies']
        
   
class UserAdmin(BaseUserAdmin):
    # The forms to add and change user instances
    form = UserChangeForm
    add_form = UserCreationForm
    
    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = ['email', 'name', 'date_of_birth', 'is_active', 'is_admin', 'display_hobbies']
    list_filter = ['is_admin', 'is_active']
    fieldsets = [
        (None, {'fields': ['email', 'password']}),
        ('Personal info', {'fields': ['name', 'date_of_birth', 'hobbies']}),
        ('Permissions', {'fields': ['is_active', 'is_admin']}),
    ]
    # add_fieldsets is not a standard ModelAdmin attribute. UserAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = [
        (None, {
            'classes': ['wide'],
            'fields': ['email', 'date_of_birth', 'password1', 'password2'],
        }),
    ]
    
    search_fields = ['email']
    ordering = ['email']
    filter_horizontal = ['hobbies']
    
    def display_hobbies(self, obj):
        return ", ".join([hobby.name for hobby in obj.hobbies.all()])
    display_hobbies.short_description = "Hobbies" # Label for the column in the admin list view

class HobbyAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']
    search_fields = ['name']

class FriendRequestAdmin(admin.ModelAdmin):
    list_display = ['sender', 'receiver', 'is_accepted', 'timestamp']
    list_filter = ['is_accepted']
    search_fields = ['sender__email', 'receiver__email']
    ordering = ['-timestamp']

@admin.register(Friend)
class FriendAdmin(admin.ModelAdmin):
    list_display = ('user1', 'user2', 'created_at')

admin.site.register(MyUser, UserAdmin)
admin.site.register(Hobby, HobbyAdmin)
admin.site.register(FriendRequest, FriendRequestAdmin)
admin.site.unregister(Group)