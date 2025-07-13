from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from app.llm.functions.detect_filters import generate_needful_filters
from selenium.webdriver.common.keys import Keys
import time
import random

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Safari/537.36",
    "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:54.0) Gecko/20100101 Firefox/54.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
]

def apply_four_star_filter(driver):
    try:
        # Wait for the 4-star filter element to be clickable
        four_star_filter = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable(
                (By.CSS_SELECTOR, "a.a-link-normal.s-navigation-item[aria-label='Apply 4 Stars & Up filter to narrow results']")
            )
        )
        
        # Scroll the element into view first
        driver.execute_script("arguments[0].scrollIntoView();", four_star_filter)
        time.sleep(1)  # Small delay to ensure scrolling is complete
        
        # Use JavaScript click to avoid element interception issues
        driver.execute_script("arguments[0].click();", four_star_filter)
        print("Successfully applied 4 Stars & Up filter")
    except TimeoutException:
        print("Timed out waiting for 4-star filter to load")
    except NoSuchElementException:
        print("4-star filter element not found")

def set_price_range(driver, min_price=0, max_price=150):
    try:
        # Wait for the price range container to be present
        price_range_container = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "p_36/range-slider_slider-item"))
        )

        # Find and set the lower bound (minimum price) slider
        lower_bound_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "p_36/range-slider_slider-item_lower-bound-slider"))
        )
        # Set the minimum price to 100
        driver.execute_script("arguments[0].value = '" + str(min_price) + "';", lower_bound_input)
        lower_bound_input.send_keys(Keys.RETURN)  # Ensure the value is applied

        # Find and set the upper bound (maximum price) slider
        upper_bound_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "p_36/range-slider_slider-item_upper-bound-slider"))
        )
        # Set the maximum price to 151 (you can adjust this value as needed)
        driver.execute_script("arguments[0].value = '" + str(max_price-10) + "';", upper_bound_input)
        upper_bound_input.send_keys(Keys.RETURN)  # Ensure the value is applied

        # Find and click the "Go" button
        go_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, "#a-autoid-1 .a-button-input"))
        )
        go_button.click()

        print(f"Price range set to ${min_price} - ${max_price}")

    except TimeoutException:
        print("Timed out waiting for price range elements to load.")
    except NoSuchElementException as e:
        print(f"Error finding price range elements: {e}")
    except Exception as e:
        print(f"An error occurred while setting price range: {e}")

def get_all_filter_types(driver):
    filter_types = {}  # Dictionary to hold filter name as key and filter type as value

    try:
        # Wait for the main refinement div to load
        refinement_div = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "s-refinements"))
        )
        print("Found refinement div")

        # Find all filter sections
        filter_sections = refinement_div.find_elements(
            By.XPATH, "//div[contains(@class, 'a-section a-spacing-none') and @role='group']"
        )
        print(f"Found {len(filter_sections)} filter sections")

        # If no filter sections found, try alternative selectors
        if len(filter_sections) == 0:
            print("No filter sections found with primary selector, trying alternatives...")
            # Try alternative selectors
            filter_sections = refinement_div.find_elements(
                By.XPATH, ".//div[contains(@class, 'a-section')]"
            )
            print(f"Found {len(filter_sections)} filter sections with alternative selector")

        for section in filter_sections:
            filter_info = {}

            try:
                # Extract the filter name from the section's heading
                heading_div = section.find_element(
                    By.XPATH, ".//div[contains(@class, 'a-spacing-small') and @role='heading']"
                )
                filter_name = heading_div.find_element(By.TAG_NAME, "span").text.strip()
                print(f"Processing filter: {filter_name}")

                # Extract the options for this filter
                options_list = section.find_element(
                    By.XPATH, ".//ul[contains(@class, 'a-unordered-list')]"
                )
                options = options_list.find_elements(By.TAG_NAME, "li")

                filter_options = []
                for option in options:
                    option_text = option.find_element(By.TAG_NAME, "span").text.strip()
                    # Determine the type of option (e.g., checkbox, button)
                    if option.find_elements(By.CSS_SELECTOR, "div.a-checkbox"):
                        option_type = "checkbox"
                    elif option.find_elements(By.TAG_NAME, "button"):
                        option_type = "button"
                    else:
                        option_type = "unknown"

                    filter_options.append(option_type)
                
                # If there are any options, store the first option type
                if filter_options:
                    filter_types[filter_name] = filter_options[0]
                    print(f"Added filter: {filter_name} -> {filter_options[0]}")

            except NoSuchElementException as e:
                print(f"Error processing filter section: {e}")
                continue

        print("Available filters and their types:", filter_types)

        # If still no filters found, return a default set
        if not filter_types:
            print("No filters detected, returning default filters")
            filter_types = {
                "Gender": "checkbox",
                "Customer Reviews": "unknown",
                "Brands": "checkbox",
                "Price Range": "unknown"
            }

    except TimeoutException:
        print("Timed out waiting for filter sections to load.")
        # Return default filters if timeout
        filter_types = {
            "Gender": "checkbox",
            "Customer Reviews": "unknown",
            "Brands": "checkbox",
            "Price Range": "unknown"
        }
    except Exception as e:
        print(f"An error occurred: {e}")
        # Return default filters if error
        filter_types = {
            "Gender": "checkbox",
            "Customer Reviews": "unknown",
            "Brands": "checkbox",
            "Price Range": "unknown"
        }

    return filter_types

def apply_checkbox_filter(driver,value,filter):
    try:
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, f"//span[contains(text(), '{filter}')]"))
        )

        # Find the Gender filter section
        gender_section = driver.find_element(By.XPATH, f"//span[contains(text(), '{filter}')]")

        # Find the list items (gender options) under this section
        gender_options = gender_section.find_elements(By.XPATH, "..//following-sibling::ul//a")
        # print(gender_options)
        # Iterate through the options to find the one that matches the gender_value (e.g., 'Men')
        for option in gender_options:
            print(option.text)
            if value.lower() in option.text.lower():
                print(f"Clicking on {value}")

                # Scroll the element into view and then click using JavaScript to avoid overlap issues
                driver.execute_script("arguments[0].scrollIntoView();", option)
                driver.execute_script("arguments[0].click();", option)

                time.sleep(2)  # Wait for the page to update
                break
        else:
            print(f"{value} option not found in the Gender filter.")
    
    except Exception as e:
        print(f"Error applying Gender filter: {e}")

def apply_button_filter(driver, value, filter_name):
    try:
        # Wait for the filter section to be visible
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, f"//span[contains(text(), \"{filter_name}\")]"))
        )

        # Find the filter section by the filter name (e.g., "Size")
        filter_section = driver.find_element(By.XPATH, f"//span[contains(text(), \"{filter_name}\")]")

        # Find all the buttons inside the filter section (for example, size options)
        buttons = filter_section.find_elements(By.XPATH, "..//following-sibling::ul//a//button")

        # Iterate through the buttons to find the one that matches the value
        for button in buttons:
            button_text = button.text.strip()  # Get the text of the button (e.g., "XXS", "XL")
            if value.lower() == button_text.lower():  # Case-insensitive comparison
                print(f"Clicking on {value} size button")
                button.click()  # Click the size filter button
                time.sleep(2)  # Wait for the page to update after clicking
                break
        else:
            print(f"{value} option not found in the {filter_name} filter.")

    except Exception as e:
        print(f"Error applying {filter_name} filter: {e}")

async def get_product_details(driver, websocket):
    products = []
    try:
        WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.CLASS_NAME, "s-result-item"))
        )

        product_elements = driver.find_elements(By.CLASS_NAME, "s-result-item")

        for product in product_elements:
            try:
                title = product.find_element(By.CLASS_NAME, "a-text-normal").text
                price = ""
                try:
                    price = product.find_element(By.CLASS_NAME, "a-price-whole").text
                except:
                    pass

                review_count = ""
                review_rating = ""
                try:
                    review_count = product.find_element(By.CLASS_NAME, "s-link-style").text
                    review_rating = product.find_element(By.CLASS_NAME, "a-icon-alt").text
                except:
                    pass

                link = product.find_element(By.CLASS_NAME, "a-link-normal").get_attribute("href")
                image_src = product.find_element(By.CLASS_NAME, "s-image").get_attribute("src")

                product_details = {
                    "title": title,
                    "price": price,
                    "review_count": review_count,
                    "review_rating": review_rating,
                    "link": link,
                    "image_src": image_src
                }
                products.append(product_details)

                # Send each product as it's processed
                await websocket.send_json(product_details)

            except Exception as e:
                print(f"Error extracting product details: {e}")

        return products

    except Exception as e:
        print(f"Error fetching products: {e}")
        return []

def process_filters(driver,filters,final_list, all_filters):
    """Process filters based on their type"""
    # if filters['price'] is not None:
    #     print("setting price")
    #     set_price_range(driver,0,filters['price'])
    # time.sleep(5)
    
    # Check if final_list is empty or None
    if not final_list:
        print("No filters to process")
        return
    
    for item in final_list:
        for key, value in item.items():
            if value is not None:
                filter_type = all_filters.get(key)
                if filter_type == 'checkbox':
                    print("checkbox")
                    apply_checkbox_filter(driver,value,key)
                    time.sleep(5)
                elif filter_type == 'button':
                    print("button")
                    apply_button_filter(driver, value,key)
                    time.sleep(5)
                else:
                    print("unknown")
            if key == 'Customer Reviews' and value is not None:
                apply_four_star_filter(driver)
                time.sleep(5)

async def start_scraping(filters, websocket):
    await websocket.send_text("starting scraping...")
    query = filters['query']
    min=filters['price_range']['min']
    max=filters['price_range']['max']
        
    options = Options()
    options.add_argument("--headless")  # Run the browser in headless mode (no GUI)
    options.add_argument("--disable-gpu")  # Disable GPU hardware acceleration
    options.add_argument("--no-sandbox")  # Avoid sandboxing, useful in some environments
    options.add_argument("--window-size=1920,1080")  # Set window size to avoid issues with some websites
    options.add_argument("--remote-debugging-port=9222")  # Optional, for debugging if necessary

    # options.add_argument("--start-maximized")  # Maximize window on start
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

    try:
        # Open the search URL
        search_url = f"https://www.amazon.com/s?k={query.replace(' ', '+')}&ref=nb_sb_noss&low-price={min}&high-price={max}"
        headers = {
            "User-Agent": random.choice(USER_AGENTS),
            "Accept-Language": "en-US,en;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive",
            "Upgrade-Insecure-Requests": "1",
        }
        driver.execute_cdp_cmd('Network.setUserAgentOverride', {
            'userAgent': headers["User-Agent"]
        })

        driver.get(search_url)
        time.sleep(5)
        await websocket.send_text("searching product...")
        # Scroll to load more products
        for _ in range(3):
            driver.execute_script("window.scrollBy(0, 1000);")
            time.sleep(2)
        await websocket.send_text("scrolling...")
        # Get the available filters
        all_filters = get_all_filter_types(driver)
        time.sleep(5)
        await websocket.send_text("scraping filters...")
        # Get the final filters list to apply
        final_list = generate_needful_filters(all_filters, filters)
        time.sleep(5)
        await websocket.send_text("Applying filters...")
        # Apply the filters
        process_filters(driver, filters, final_list, all_filters)
        await websocket.send_text("scraping products...")
        # Fetch product details and send incrementally
        products = await get_product_details(driver, websocket)

        return {"products": products}

    except Exception as e:
        print(f"An error occurred: {e}")
        return {"error": str(e)}

    finally:
        driver.quit()

