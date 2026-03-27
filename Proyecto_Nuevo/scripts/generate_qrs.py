import qrcode
import os

os.makedirs('Proyecto_Nuevo/imagenes', exist_ok=True)

urls = [
    ("https://youtu.be/3b4Vv8zIwt4?si=y4RfqwaY0XDqKJTE", "qr1.png"),
    ("https://youtu.be/Opcentm_0RE?si=mkPstKz9bJ4oEPrv", "qr2.png"),
    ("https://youtu.be/PfL1mqi-uro?si=ZaRrYE_yeviXdsZ3", "qr3.png")
]

for url, filename in urls:
    qr = qrcode.QRCode(version=1, box_size=10, border=4)
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    img.save(f'Proyecto_Nuevo/imagenes/{filename}')
    print(f'Generated {filename}')
