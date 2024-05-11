from PIL import Image

def encrypt_image(image_path, encryption_key):

    img = Image.open(image_path)
    width, height = img.size
    
    img = img.convert('RGB')
    
    encrypted_pixels = []
    for y in range(height):
        for x in range(width):
            r, g, b = img.getpixel((x, y))
        
            r ^= encryption_key
            g ^= encryption_key
            b ^= encryption_key
            encrypted_pixels.append((r, g, b))
    
    encrypted_img = Image.new('RGB', (width, height))
    encrypted_img.putdata(encrypted_pixels)
    
    return encrypted_img

def decrypt_image(image_path, encryption_key):

    encrypted_img = Image.open(image_path)
    width, height = encrypted_img.size
    
    encrypted_img = encrypted_img.convert('RGB')
    
    decrypted_pixels = []
    for y in range(height):
        for x in range(width):
            r, g, b = encrypted_img.getpixel((x, y))
        
            r ^= encryption_key
            g ^= encryption_key
            b ^= encryption_key
            decrypted_pixels.append((r, g, b))
    
    decrypted_img = Image.new('RGB', (width, height))
    decrypted_img.putdata(decrypted_pixels)
    
    return decrypted_img

encrypted_img = encrypt_image(r"C:\Users\91635\Desktop\INTERNSHIP\profile.jpg", encryption_key=123)
encrypted_img.save('encrypted_image.jpg')

decrypted_img = decrypt_image('encrypted_image.jpg', encryption_key=123)
decrypted_img.save('decrypted_image.jpg')

