from django.test import TestCase
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import time
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains


class UserTests(TestCase):
    def setUp(self):
        # selenium setup
        options = Options()
        options.headless = True  # Run in headless mode for testing
        service = Service('/Users/catrionaanderson/Downloads/chromedriver')  # macOS path
        self.driver = webdriver.Chrome(service=service, options=options)
        self.driver.implicitly_wait(10)  # Implicit wait for elements to load
        print(f"Starting test: {self._testMethodName}")


    def tearDown(self):
        self.driver.quit()  # Close the browser after each test
        print(f"Completed test: {self._testMethodName}")


    def login(self, email, password):
        self.driver.get("http://localhost:8000/login/")  
        time.sleep(2)

        email_field = self.driver.find_element(By.NAME, "username")
        password_field = self.driver.find_element(By.NAME, "password")
        login_button = self.driver.find_element(By.XPATH, "//button[contains(text(),'Login')]")

        email_field.send_keys(email)  
        password_field.send_keys(password) 
        login_button.click()
        time.sleep(2)


    def test_1_signup(self):
        self.driver.get("http://localhost:8000/signup/") 
        time.sleep(2) 

        # Locate signup form
        email_field = self.driver.find_element(By.NAME, "email")
        name_field = self.driver.find_element(By.NAME, "name")

        month_select = self.driver.find_element(By.NAME, "date_of_birth_month")
        day_select = self.driver.find_element(By.NAME, "date_of_birth_day")
        year_select = self.driver.find_element(By.NAME, "date_of_birth_year")

        password1_field = self.driver.find_element(By.NAME, "password1")
        password2_field = self.driver.find_element(By.NAME, "password2")
        signup_button = self.driver.find_element(By.XPATH, "//button[contains(text(),'Sign Up')]")

        # Fill in the signup form
        email_field.send_keys("testuser@example.com")
        name_field.send_keys("Test User")

        month_select.send_keys("January")
        day_select.send_keys("01")
        year_select.send_keys("2000")

        password1_field.send_keys("TestPassword123")
        password2_field.send_keys("TestPassword123")

        # Submit the signup form
        signup_button.click()
        time.sleep(2)

        # Check if redirected to frontend
        self.assertEqual(self.driver.current_url, "http://localhost:8000/")


    def test_2_login(self):
        self.login("testuser@example.com", "TestPassword123") #login using the user just created
        self.assertEqual(self.driver.current_url, "http://localhost:5173/")


    def test_3_profile_update(self):
        self.login("testuser@example.com", "TestPassword123")
        time.sleep(2)

        # Go to profile page
        self.driver.get("http://localhost:5173/profile/")
        time.sleep(2)

        # Click on the 'Edit Profile' button to open the modal
        edit_button = self.driver.find_element(By.XPATH, "//button[contains(text(),'Edit Profile')]")
        edit_button.click()
        time.sleep(1)

        # Locate fields in the modal to update the profile
        name_field = self.driver.find_element(By.ID, "name")
        email_field = self.driver.find_element(By.ID, "email")
        dob_field = self.driver.find_element(By.ID, "dob") 
        save_button = self.driver.find_element(By.XPATH, "//button[contains(text(),'Save Changes')]")

        # Modify profile fields in the modal
        name_field.clear()
        name_field.send_keys("Updated User")
        email_field.clear()
        email_field.send_keys("updateduser@example.com")
        dob_field.clear()
        dob_field.send_keys("01-01-2025")

        # Submit the profile update form
        time.sleep(2)
        save_button.click()
        time.sleep(2)

        # Check if the update was successful
        self.assertEqual(self.driver.current_url, "http://localhost:5173/profile/") 
        self.assertIn("Updated User", self.driver.page_source)  
        self.assertIn("updateduser@example.com", self.driver.page_source) 
        self.assertIn("2025-01-01", self.driver.page_source)


    def test_4_filter_by_age(self):
        # Log in as user2 already existing with hobbies
        self.login("frienduser@example.com", "TestPassword123")

        # Go to the similar users page
        self.driver.get("http://localhost:5173/similar-users")
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.ID, "min-age"))
        )

        # Locate the Min Age and Max Age input fields
        min_age_input = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.ID, "min-age"))
        )
        max_age_input = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.ID, "max-age"))
        )

        # Clear the input fields
        min_age_input.clear()
        max_age_input.clear()

        # Enter the values in the fields
        min_age_input.send_keys("20")
        max_age_input.send_keys("20")

        # Locate the filter button
        filter_button = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//button[contains(text(),'Apply Filter')]"))
        )

        # Use JavaScript to ensure the button is fully in view
        self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", filter_button)

        # Attempt interaction with the button
        try:
            # Use ActionChains to click the button
            ActionChains(self.driver).move_to_element(filter_button).click().perform()
        except Exception:
            # Fallback to JavaScript click if ActionChains fails
            self.driver.execute_script("arguments[0].click();", filter_button)

        # Deliberate wait to allow observation of results
        time.sleep(5)  # Adjust the time (in seconds) based on your needs

        # Wait for the list to populate
        users_list = WebDriverWait(self.driver, 10).until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, ".list-group-item"))
        )

        # Assert the list has results
        self.assertGreater(len(users_list), 0, "No users found within the specified age range.")


    def test_5_send_friend_request(self):
        # Log in as our test user
        self.login("updateduser@example.com", "TestPassword123")
        self.driver.get("http://localhost:5173/friends")  
        time.sleep(2)

        #send friend request to the other friend user
        email_field = self.driver.find_element(By.CSS_SELECTOR, ".input-email")
        email_field.send_keys("frienduser@example.com")
        time.sleep(2)

        # Locate and click the 'Send Friend Request' button
        send_request_button = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Send Request')]"))
        )
        send_request_button.click()
        time.sleep(2)
        


    def test_6_accept_friend_request(self):
        # Log in as user2 (the one who received the friend request)
        self.login("frienduser@example.com", "TestPassword123")
        
        # Go to the friends page
        self.driver.get("http://localhost:5173/friends")  
        time.sleep(2)

        # Locate and click the 'Accept Friend Request' button
        accept_button = self.driver.find_element(By.XPATH, "//button[contains(text(),'Accept')]")
        accept_button.click()
        time.sleep(2)

        # Check if the friend has been added to the friend's list
        self.driver.get("http://localhost:5173/friends/") 
        time.sleep(2)
        
        # Verify the sender appears in the Friends list
        friends_list = self.driver.find_elements(By.CSS_SELECTOR, "ul li")
        friend_names = [friend.text for friend in friends_list]
        self.assertIn("Updated User", friend_names, "Accepted friend not displayed in Friends list.")