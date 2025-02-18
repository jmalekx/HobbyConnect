from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
from django.core.exceptions import ValidationError

class MyUserManager(BaseUserManager):
    def create_user(self, email, date_of_birth, password=None):
        """
        Creates and saves a User with the given email, date of
        birth and password.
        """
        if not email:
            raise ValueError('Users must have an email address')
        
        user = self.model(
            email=self.normalize_email(email),
            date_of_birth=date_of_birth,
        )
        
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, date_of_birth, password=None):
        """
        Creates and saves a superuser with the given email, date of
        birth and password.
        """
        user = self.create_user(
            email,
            password=password,
            date_of_birth=date_of_birth,
        )
        user.is_admin = True
        user.save(using=self._db)
        return user
    
class Hobby(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return self.name
    
class MyUser(AbstractBaseUser):
    email = models.EmailField(
        verbose_name='email address',
        max_length=255,
        unique=True,
    )
    name = models.CharField(default="", max_length=255)
    date_of_birth = models.DateField()
    hobbies = models.ManyToManyField(Hobby, related_name="users")
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    testing_field = models.CharField(max_length=255, default="testing")
    
    objects = MyUserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['date_of_birth']
    
    def __str__(self):
        return self.email
    
    def add_hobby(self, hobby_name):
        """Add a hobby to the user."""
        hobby, created = Hobby.objects.get_or_create(name=hobby_name)
        self.hobbies.add(hobby)
        return hobby

    def remove_hobby(self, hobby_name):
        """Remove a hobby from the user."""
        try:
            hobby = Hobby.objects.get(name=hobby_name)
            self.hobbies.remove(hobby)
        except Hobby.DoesNotExist:
            raise ValidationError(f"Hobby '{hobby_name}' does not exist.")
    
    def get_hobbies(self):
        """Return a list of hobbies for the user."""
        return self.hobbies.all()
    
    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return self.is_admin
    
    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True
    
    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_admin

class FriendRequest(models.Model):
    """Class for sent and received friend requests."""
    sender = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name="sent_requests")
    receiver = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name="received_requests")
    is_accepted = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"From {self.sender.email} to {self.receiver.email} - {'Accepted' if self.is_accepted else 'Pending'}"

    def clean(self):
        # Skip validation for updates
        if self.pk:  # If the instance already exists in the database
            return

        # Check if the sender and receiver are the same
        if self.sender == self.receiver:
            raise ValidationError("You cannot send a friend request to yourself.")

        # Check if already friends
        if Friend.objects.filter(user1=self.sender, user2=self.receiver).exists() or \
           Friend.objects.filter(user1=self.receiver, user2=self.sender).exists():
            raise ValidationError("You are already friends.")

        # Check if a pending friend request already exists
        if FriendRequest.objects.filter(sender=self.sender, receiver=self.receiver, is_accepted=False).exists():
            raise ValidationError("Friend request already sent and is pending.")

        # Check if a reversed pending friend request exists
        if FriendRequest.objects.filter(sender=self.receiver, receiver=self.sender, is_accepted=False).exists():
            raise ValidationError("Friend request already received and is pending.")

    def save(self, *args, **kwargs):
        self.clean()  # Call clean to ensure validation
        super().save(*args, **kwargs)

class Friend(models.Model):
    user1 = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name="friend_user1")
    user2 = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name="friend_user2")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Friend between {self.user1.email} and {self.user2.email}"

    def clean(self):
        #ensure not already friends
        if Friend.objects.filter(user1=self.user1, user2=self.user2).exists() or \
           Friend.objects.filter(user1=self.user2, user2=self.user1).exists():
            raise ValidationError("Friend already exists.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)
