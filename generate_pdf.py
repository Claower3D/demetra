import os
import json
import csv
from datetime import datetime, timedelta
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

# Registration of Cyrillic font Arial
FONT_PATH = "C:\\Windows\\Fonts\\arial.ttf"
FONT_BOLD_PATH = "C:\\Windows\\Fonts\\arialbd.ttf"

if os.path.exists(FONT_PATH):
    pdfmetrics.registerFont(TTFont('Arial', FONT_PATH))
if os.path.exists(FONT_BOLD_PATH):
    pdfmetrics.registerFont(TTFont('Arial-Bold', FONT_BOLD_PATH))

class NumberedCanvas(canvas.Canvas):
    """
    Two-pass canvas to calculate total page count dynamically and print
    uniform headers and footers with page numbering.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Arial", 8)
        self.setFillColorRGB(0.3, 0.3, 0.3)
        
        # Header (Top of each page)
        self.drawString(54, 785, "ANTYGRAVITY | БИН: 240640012345")
        gen_date_str = datetime.now().strftime("%d.%m.%Y %H:%M")
        self.drawRightString(541, 785, f"Дата генерации: {gen_date_str}")
        self.setStrokeColorRGB(0.8, 0.8, 0.8)
        self.setLineWidth(0.5)
        self.line(54, 778, 541, 778)
        
        # Footer (Bottom of each page)
        self.line(54, 55, 541, 55)
        self.drawString(54, 42, "Сформировано автоматически системой Antygravity. Соответствует НК РК (ред. 2024–2025).")
        self.drawRightString(541, 42, f"Страница {self._pageNumber} из {page_count}")
        
        self.restoreState()

def get_tax_calculations(date_str, amount_without_vat, vat_amount):
    """
    Calculates Tax Q, VAT deadlines and ESF deadlines.
    """
    dt = datetime.strptime(date_str, "%Y-%m-%d")
    year = dt.year
    month = dt.month
    
    quarter = (month - 1) // 3 + 1
    
    if quarter == 1:
        vat_deadline = f"15.05.{year}"
    elif quarter == 2:
        vat_deadline = f"15.08.{year}"
    elif quarter == 3:
        vat_deadline = f"15.11.{year}"
    else:
        vat_deadline = f"15.02.{year + 1}"
        
    esf_deadline_dt = dt + timedelta(days=15)
    esf_deadline = esf_deadline_dt.strftime("%d.%m.%Y")
    
    return {
        "quarter": quarter,
        "vat_deadline": vat_deadline,
        "esf_deadline": esf_deadline
    }

def generate_order_pdf(order_data):
    """
    Generates a professional 4-block PDF document based on order_data JSON.
    Also exports Block 3 tax data to a CSV file.
    """
    # 1. Parse Input
    order_number = order_data.get("order_number", "000")
    order_date_raw = order_data.get("date", "2025-06-09")
    
    # Format dates
    dt_obj = datetime.strptime(order_date_raw, "%Y-%m-%d")
    order_date_formatted = dt_obj.strftime("%d.%m.%Y")
    
    client_name = order_data.get("client_name", "Не указан")
    client_bin = order_data.get("client_bin", "Не указан")
    service = order_data.get("service", "Не указано")
    quantity = int(order_data.get("quantity", 1))
    price_without_vat = float(order_data.get("price_without_vat", 0.0))
    payment_method = order_data.get("payment_method", "безналичные")
    
    # 2. Math Calculations
    amount_without_vat = price_without_vat * quantity
    vat_amount = amount_without_vat * 0.12
    total_with_vat = amount_without_vat + vat_amount
    
    kpn_base = amount_without_vat
    estimated_kpn = kpn_base * 0.20
    
    tax_info = get_tax_calculations(order_date_raw, amount_without_vat, vat_amount)
    
    # 3. Create PDF Filename
    pdf_filename = f"antygravity_order_{order_number}_{order_date_raw}.pdf"
    
    # Setup document template (A4, margins)
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=A4,
        leftMargin=54,
        rightMargin=54,
        topMargin=80,
        bottomMargin=80
    )
    
    # Styles
    styles = getSampleStyleSheet()
    style_normal = ParagraphStyle(
        'NormalCyr',
        parent=styles['Normal'],
        fontName='Arial',
        fontSize=10,
        leading=14,
        textColor='#222222'
    )
    style_bold = ParagraphStyle(
        'BoldCyr',
        parent=style_normal,
        fontName='Arial-Bold'
    )
    style_title = ParagraphStyle(
        'TitleCyr',
        parent=style_normal,
        fontName='Arial-Bold',
        fontSize=18,
        leading=22,
        textColor='#111111',
        alignment=1, # Center
        spaceAfter=15
    )
    style_subtitle = ParagraphStyle(
        'SubTitleCyr',
        parent=style_normal,
        fontName='Arial-Bold',
        fontSize=12,
        leading=16,
        textColor='#333333',
        spaceAfter=8
    )
    style_center = ParagraphStyle(
        'CenterCyr',
        parent=style_normal,
        alignment=1
    )
    style_right = ParagraphStyle(
        'RightCyr',
        parent=style_normal,
        alignment=2
    )
    
    # Receipt Styles
    style_receipt = ParagraphStyle(
        'ReceiptCyr',
        fontName='Arial',
        fontSize=9,
        leading=12,
        textColor='#000000'
    )
    style_receipt_bold = ParagraphStyle(
        'ReceiptBoldCyr',
        parent=style_receipt,
        fontName='Arial-Bold'
    )
    style_receipt_center = ParagraphStyle(
        'ReceiptCenterCyr',
        parent=style_receipt,
        alignment=1
    )
    style_receipt_right = ParagraphStyle(
        'ReceiptRightCyr',
        parent=style_receipt,
        alignment=2
    )
    
    story = []
    
    # ==========================================
    # BLOCK 1: ЧЕК ДЛЯ КЛИЕНТА (ФИСКАЛЬНЫЙ ЧЕК)
    # ==========================================
    story.append(Paragraph("БЛОК 1 — ЧЕК ДЛЯ КЛИЕНТА", style_title))
    story.append(Spacer(1, 10))
    
    receipt_data = [
        [Paragraph("<b>*** ФИСКАЛЬНЫЙ ЧЕК ***</b>", style_receipt_center)],
        [Paragraph("<b>ANTYGRAVITY</b>", style_receipt_center)],
        [Paragraph("ТОО \"Antygravity\"", style_receipt_center)],
        [Paragraph("БИН: 240640012345", style_receipt)],
        [Paragraph("Адрес: г. Алматы, пр. Аль-Фараби, д. 77/7", style_receipt)],
        [Paragraph(f"Дата и время: {order_date_formatted} 12:00", style_receipt)],
        [Paragraph("----------------------------------------------------------------", style_receipt_center)],
        [Paragraph(f"<b>{service}</b>", style_receipt_bold)],
        [Paragraph(f"{quantity} × {price_without_vat:,.2f} ₸ = {amount_without_vat:,.2f} ₸ (без НДС)", style_receipt)],
        [Paragraph(f"НДС 12%: {vat_amount:,.2f} ₸", style_receipt_right)],
        [Paragraph("----------------------------------------------------------------", style_receipt_center)],
        [Paragraph(f"<b>ИТОГО К ОПЛАТЕ: {total_with_vat:,.2f} ₸</b>", ParagraphStyle('ReceiptTotal', parent=style_receipt_bold, fontSize=11, leading=14))],
        [Paragraph(f"Способ оплаты: {payment_method.upper()}", style_receipt)],
        [Paragraph("----------------------------------------------------------------", style_receipt_center)],
        [Paragraph("Спасибо за покупку!", style_receipt_center)],
        [Spacer(1, 15)],
        [Paragraph("Подпись и печать Исполнителя:<br/><br/>_______________________ (М.П.)", style_receipt)]
    ]
    
    receipt_table = Table(receipt_data, colWidths=[280], hAlign='CENTER')
    receipt_table.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 1, '#111111'),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
        ('BACKGROUND', (0,0), (-1,-1), '#fafafa'),
    ]))
    
    story.append(receipt_table)
    story.append(PageBreak())
    
    # ==========================================
    # BLOCK 2: АКТ ВЫПОЛНЕННЫХ РАБОТ / НАКЛАДНАЯ
    # ==========================================
    story.append(Paragraph("БЛОК 2 — АКТ ВЫПОЛНЕННЫХ РАБОТ (ОКАЗАННЫХ УСЛУГ)", style_title))
    story.append(Paragraph(f"<b>Акт № {order_number} от {order_date_formatted} г.</b>", style_subtitle))
    story.append(Spacer(1, 10))
    
    contractor_text = """<b>Исполнитель:</b> ТОО "Antygravity"<br/>
    БИН: 240640012345, Адрес: Республика Казахстан, г. Алматы, пр. Аль-Фараби, д. 77/7<br/>
    Банк: АО "ForteBank", БИК: KTEBKZKX, ИИK: KZ123456789012345678"""
    
    customer_text = f"""<b>Заказчик:</b> {client_name}<br/>
    БИН/ИИН: {client_bin}"""
    
    party_table = Table([
        [Paragraph(contractor_text, style_normal)],
        [Spacer(1, 4)],
        [Paragraph(customer_text, style_normal)]
    ], colWidths=[487])
    party_table.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 0.5, '#bbbbbb'),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('BACKGROUND', (0,0), (-1,-1), '#fdfdfd')
    ]))
    story.append(party_table)
    story.append(Spacer(1, 15))
    
    # Table for service details
    grid_header = [
        Paragraph("<b>№</b>", style_center),
        Paragraph("<b>Наименование работ (услуг)</b>", style_normal),
        Paragraph("<b>Ед. изм.</b>", style_center),
        Paragraph("<b>Кол-во</b>", style_center),
        Paragraph("<b>Цена без НДС (₸)</b>", style_right),
        Paragraph("<b>Сумма без НДС (₸)</b>", style_right)
    ]
    
    grid_row = [
        Paragraph("1", style_center),
        Paragraph(service, style_normal),
        Paragraph("услуга", style_center),
        Paragraph(str(quantity), style_center),
        Paragraph(f"{price_without_vat:,.2f}", style_right),
        Paragraph(f"{amount_without_vat:,.2f}", style_right)
    ]
    
    grid_data = [grid_header, grid_row]
    grid_table = Table(grid_data, colWidths=[25, 202, 50, 45, 80, 85])
    grid_table.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 0.5, '#aaaaaa'),
        ('BACKGROUND', (0,0), (-1,0), '#eeeeee'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(grid_table)
    story.append(Spacer(1, 10))
    
    # Totals table
    totals_data = [
        [Paragraph("", style_normal), Paragraph("<b>Итого без НДС:</b>", style_right), Paragraph(f"{amount_without_vat:,.2f} ₸", style_right)],
        [Paragraph("", style_normal), Paragraph("<b>НДС 12%:</b>", style_right), Paragraph(f"{vat_amount:,.2f} ₸", style_right)],
        [Paragraph("", style_normal), Paragraph("<b>Всего с НДС:</b>", style_right), Paragraph(f"<b>{total_with_vat:,.2f} ₸</b>", style_right)]
    ]
    totals_table = Table(totals_data, colWidths=[200, 187, 100])
    totals_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('TOPPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(totals_table)
    story.append(Spacer(1, 20))
    
    story.append(Paragraph("<b>Услуги выполнены в полном объёме, претензий нет.</b>", style_bold))
    story.append(Spacer(1, 35))
    
    # Signatures
    sig_data = [
        [Paragraph("<b>Исполнитель:</b>", style_normal), Paragraph("<b>Заказчик:</b>", style_normal)],
        [Spacer(1, 30), Spacer(1, 30)],
        [Paragraph("___________________ / ________________", style_normal), Paragraph("___________________ / ________________", style_normal)],
        [Paragraph("М.П.", style_normal), Paragraph("М.П.", style_normal)]
    ]
    sig_table = Table(sig_data, colWidths=[240, 247])
    sig_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(sig_table)
    story.append(PageBreak())
    
    # ==========================================
    # BLOCK 3: ДАННЫЕ ДЛЯ НАЛОГОВОЙ (ЭСФ и декларации)
    # ==========================================
    story.append(Paragraph("БЛОК 3 — ДАННЫЕ ДЛЯ НАЛОГОВОГО УЧЕТА (ЭСФ И ДЕКЛАРАЦИИ)", style_title))
    story.append(Spacer(1, 10))
    
    tax_desc = f"""Этот блок содержит регламентированные данные для формирования Налоговой отчетности и выписки ЭСФ
    в соответствии с Налоговым кодексом Республики Казахстан (НК РК)."""
    story.append(Paragraph(tax_desc, style_normal))
    story.append(Spacer(1, 15))
    
    tax_fields_data = [
        [Paragraph("<b>Показатель</b>", style_bold), Paragraph("<b>Значение в тенге (₸)</b>", style_bold), Paragraph("<b>Налоговый регламент / Декларация</b>", style_bold)],
        
        [Paragraph("Оборот без НДС (размер оборота)", style_normal), Paragraph(f"{amount_without_vat:,.2f}", style_right), Paragraph("Облагаемый оборот, ст. 369 НК РК", style_normal)],
        [Paragraph("Ставка НДС", style_normal), Paragraph("12%", style_right), Paragraph("ст. 422 НК РК", style_normal)],
        [Paragraph("Сумма НДС (12%)", style_normal), Paragraph(f"{vat_amount:,.2f}", style_right), Paragraph("Начисляется к уплате", style_normal)],
        [Paragraph("Оборот с НДС (Итого)", style_normal), Paragraph(f"{total_with_vat:,.2f}", style_right), Paragraph("Полная стоимость с учетом налогов", style_normal)],
        
        [Paragraph("База по КПН (Доход)", style_normal), Paragraph(f"{kpn_base:,.2f}", style_right), Paragraph("Предварительный доход, ст. 224 НК РК", style_normal)],
        [Paragraph("Ориентировочный КПН (20%)", style_normal), Paragraph(f"{estimated_kpn:,.2f}", style_right), Paragraph("Для Ф.100.00 (точный КПН - по итогам года)", style_normal)],
        
        [Paragraph("Начисленный НДС по заказу", style_normal), Paragraph(f"{vat_amount:,.2f}", style_right), Paragraph("Декларация по НДС (Форма 300.00)", style_normal)],
        [Paragraph("Налоговый период (Квартал)", style_normal), Paragraph(f"{tax_info['quarter']}-й квартал {dt_obj.year}", style_right), Paragraph("ст. 424 НК РК", style_normal)],
        [Paragraph("Срок сдачи Ф.300.00", style_normal), Paragraph(tax_info['vat_deadline'], style_right), Paragraph("Не позднее 15-го числа 2-го месяца после квартала", style_normal)],
        
        [Paragraph("Срок выписки ЭСФ (esf.gov.kz)", style_normal), Paragraph(tax_info['esf_deadline'], style_right), Paragraph("Не позднее 15 календарных дней после даты оборота", style_normal)],
        [Paragraph("Тип оборота в ЭСФ", style_normal), Paragraph("Облагаемый оборот", style_right), Paragraph("Раздел G ЭСФ", style_normal)]
    ]
    
    tax_table = Table(tax_fields_data, colWidths=[180, 110, 197])
    tax_table.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 0.5, '#cccccc'),
        ('BACKGROUND', (0,0), (-1,0), '#f5f5f5'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(tax_table)
    story.append(Spacer(1, 15))
    story.append(PageBreak())
    
    # ==========================================
    # BLOCK 4: СВОДНАЯ ТАБЛИЦА ПО ЗАКАЗУ
    # ==========================================
    story.append(Paragraph("БЛОК 4 — СВОДНАЯ ТАБЛИЦА ПО ЗАКАЗУ", style_title))
    story.append(Spacer(1, 15))
    
    summary_header = [
        Paragraph("<b>№</b>", style_center),
        Paragraph("<b>Дата</b>", style_center),
        Paragraph("<b>Клиент</b>", style_normal),
        Paragraph("<b>Услуга</b>", style_normal),
        Paragraph("<b>Без НДС</b>", style_right),
        Paragraph("<b>НДС 12%</b>", style_right),
        Paragraph("<b>С НДС</b>", style_right),
        Paragraph("<b>КПН ~20%</b>", style_right),
        Paragraph("<b>ЭСФ до</b>", style_center)
    ]
    
    summary_row = [
        Paragraph(order_number, style_center),
        Paragraph(order_date_formatted, style_center),
        Paragraph(client_name, style_normal),
        Paragraph(service, style_normal),
        Paragraph(f"{amount_without_vat:,.0f}", style_right),
        Paragraph(f"{vat_amount:,.0f}", style_right),
        Paragraph(f"{total_with_vat:,.0f}", style_right),
        Paragraph(f"{estimated_kpn:,.0f}", style_right),
        Paragraph(tax_info['esf_deadline'], style_center)
    ]
    
    summary_data = [summary_header, summary_row]
    summary_table = Table(summary_data, colWidths=[25, 50, 80, 80, 52, 50, 50, 50, 50])
    summary_table.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 0.5, '#aaaaaa'),
        ('BACKGROUND', (0,0), (-1,0), '#e8e8e8'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(summary_table)
    
    story.append(Spacer(1, 15))
    story.append(Paragraph("<i>Данная таблица формируется нарастающим итогом за период.</i>", style_normal))
    
    # 4. Build PDF
    doc.build(story, canvasmaker=NumberedCanvas)
    
    # 5. Export Block 3 Tax Data to CSV for 1C
    csv_filename = f"antygravity_order_{order_number}_{order_date_raw}_tax.csv"
    with open(csv_filename, mode='w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f, delimiter=';')
        # Write headers
        writer.writerow([
            "OrderNumber", "Date", "ClientName", "ClientBIN", "Service", "Quantity", 
            "PriceWithoutVAT", "AmountWithoutVAT", "VAT_12", "TotalWithVAT", 
            "EstimatedKPN_20", "TaxQuarter", "VATDeadline", "ESFDeadline"
        ])
        # Write values
        writer.writerow([
            order_number, order_date_raw, client_name, client_bin, service, quantity,
            price_without_vat, amount_without_vat, vat_amount, total_with_vat,
            estimated_kpn, tax_info['quarter'], tax_info['vat_deadline'], tax_info['esf_deadline']
        ])
        
    print(f"Successfully generated PDF: {pdf_filename}")
    print(f"Successfully generated CSV for 1C: {csv_filename}")
    
    return pdf_filename, csv_filename

if __name__ == "__main__":
    # Test JSON structure
    test_json = {
        "order_number": "001",
        "date": "2025-06-09",
        "client_name": "ТОО Ромашка",
        "client_bin": "123456789012",
        "service": "Услуги флоатинга",
        "quantity": 1,
        "price_without_vat": 50000,
        "payment_method": "безналичные"
    }
    generate_order_pdf(test_json)
