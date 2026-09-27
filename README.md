# TERCELO — เว็บขายยาง

```
fe/   เว็บไซต์ (Next.js 16 + React 19 + Tailwind 4 + three.js)
db/   สคริปต์แปลงไฟล์ราคา Excel → JSON ที่เว็บใช้
be/   (ว่าง) ยังไม่ต้องใช้ — เว็บทำงานได้โดยไม่มี backend
```

## รันเว็บ

```bash
cd fe
npm install
npm run dev        # http://localhost:3000
npm run build      # build สำหรับขึ้นเว็บจริง
```

## อัปเดตราคา / สต็อก

แก้ไฟล์ `ราคา.xlsx` (คอลัมน์ Size, PR, Pattern, Quantity, Net Price) แล้วรัน

```bash
python db/xlsx_to_json.py "C:/Users/ASUS/Downloads/ราคา.xlsx"
```

สคริปต์จะเขียน `fe/src/data/products.json` ใหม่ (รวมแถวที่ขนาด/รุ่นซ้ำกัน และคิดราคารวม VAT 7%)

## แก้เนื้อหา

| ต้องการแก้ | ไฟล์ |
| --- | --- |
| ข้อมูลรุ่นดอกยาง คำอธิบาย คะแนน | `fe/src/data/catalog.ts` |
| โปรโมชั่น (เพิ่ม/ลบ/เปลี่ยนวันที่) | `fe/src/data/promotions.ts` |
| ส่วนลดตามจำนวนในตะกร้า | `volumeTiers` ใน `fe/src/data/catalog.ts` |
| LINE Official | `LINE_OA` ใน `fe/src/data/catalog.ts` |
| ประเภทรถ / ขนาดยางเดิม ในหน้าลองกับรถ | `fe/src/lib/fitment.ts` |
| สีธีม สว่าง/มืด | `fe/src/app/globals.css` |

## หน้าเว็บ

- `/` หน้าแรก — ยาง 3 มิติ ค้นหาตามขนาด ประเภทรถ
- `/tyres` ร้านค้า + ตัวกรอง · `/tyres/[รุ่น]` รายละเอียดรุ่น
- `/try` ลองใส่กับรถ (รถตัวอย่าง หรืออัปโหลดรูปรถตัวเอง — รูปไม่ถูกอัปโหลดไปไหน)
- `/promotions` โปรโมชั่น · `/dealer` โปรแกรมตัวแทน Kick Starter + เครื่องคำนวณ
- `/cart` สรุปคำสั่งซื้อ → ส่งทาง LINE

ภาพยางทั้งหมดสร้างด้วยโค้ด (`fe/src/lib/tread.ts`, `fe/src/components/tire-3d.tsx`) ไม่ใช้ไฟล์รูป
