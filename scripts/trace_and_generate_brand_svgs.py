import os
import cv2
import numpy as np
from PIL import Image

def contour_to_svg_path(contour, offset_x=0, offset_y=0):
    pts = contour.reshape(-1, 2)
    if len(pts) < 3:
        return ""
    d_parts = [f"M {pts[0][0] - offset_x:.1f} {pts[0][1] - offset_y:.1f}"]
    for pt in pts[1:]:
        d_parts.append(f"L {pt[0] - offset_x:.1f} {pt[1] - offset_y:.1f}")
    d_parts.append("Z")
    return " ".join(d_parts)

def get_compound_path(outer_c, holes, offset_x=0, offset_y=0):
    parts = [contour_to_svg_path(outer_c, offset_x, offset_y)]
    for h in holes:
        parts.append(contour_to_svg_path(h, offset_x, offset_y))
    return " ".join(parts)

def main():
    os.makedirs('public/brand', exist_ok=True)
    os.makedirs('docs', exist_ok=True)

    # 1. Load ZenPaaw Logo colored.png (5435 x 4480)
    source_path = '../Logo Assets/ZenPaaw Logo colored.png'
    if not os.path.exists(source_path):
        source_path = 'Logo Assets/ZenPaaw Logo colored.png'
    
    img = cv2.imread(source_path)
    h, w = img.shape[:2]

    # Threshold for Yellow: Paw and Tagline
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    lower_yellow = np.array([15, 120, 150])
    upper_yellow = np.array([35, 255, 255])
    yellow_mask = cv2.inRange(hsv, lower_yellow, upper_yellow)

    # Threshold for White: Wordmark
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    _, white_mask = cv2.threshold(gray, 210, 255, cv2.THRESH_BINARY)
    # Ensure white mask is only within wordmark Y band (2400 to 3100)
    wm_mask_y = np.zeros_like(white_mask)
    wm_mask_y[2400:3100, :] = 255
    white_mask = cv2.bitwise_and(white_mask, wm_mask_y)

    # Separate Paw from Tagline by Y
    paw_mask = np.zeros_like(yellow_mask)
    paw_mask[800:2350, :] = yellow_mask[800:2350, :]

    tagline_mask = np.zeros_like(yellow_mask)
    tagline_mask[3100:3600, :] = yellow_mask[3100:3600, :]

    # -------------------------------------------------------------
    # A. PAW SYMBOL EXTRACTION
    # -------------------------------------------------------------
    paw_contours, _ = cv2.findContours(paw_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_TC89_KCOS)
    # Filter valid paw contours
    paw_contours = [c for c in paw_contours if cv2.contourArea(c) > 50000]
    # We should have 5 contours: heel pad (largest) + 4 toes
    paw_contours.sort(key=lambda c: cv2.contourArea(c), reverse=True)
    heel_contour = paw_contours[0]
    toes = paw_contours[1:5]
    # Sort toes from left to right: outer-left, inner-left, inner-right, outer-right
    toes.sort(key=lambda c: cv2.boundingRect(c)[0])
    toe_outer_left = toes[0]
    toe_inner_left = toes[1]
    toe_inner_right = toes[2]
    toe_outer_right = toes[3]

    # Paw bounding box
    all_paw_pts = np.vstack([heel_contour, toe_outer_left, toe_inner_left, toe_inner_right, toe_outer_right])
    px, py, pw, ph = cv2.boundingRect(all_paw_pts)
    # Add small 20px padding
    px -= 20; py -= 20; pw += 40; ph += 40

    heel_d = contour_to_svg_path(heel_contour, px, py)
    toe_ol_d = contour_to_svg_path(toe_outer_left, px, py)
    toe_il_d = contour_to_svg_path(toe_inner_left, px, py)
    toe_ir_d = contour_to_svg_path(toe_inner_right, px, py)
    toe_or_d = contour_to_svg_path(toe_outer_right, px, py)

    symbol_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {pw} {ph}" fill="none">
  <!-- ZenPaaw Symbol (Yellow Paw with cut-out Z) -->
  <g fill="#FFC800">
    <path id="zenpaaw-toe-outer-left" d="{toe_ol_d}" />
    <path id="zenpaaw-toe-inner-left" d="{toe_il_d}" />
    <path id="zenpaaw-toe-inner-right" d="{toe_ir_d}" />
    <path id="zenpaaw-toe-outer-right" d="{toe_or_d}" />
    <path id="zenpaaw-heel-pad" d="{heel_d}" />
  </g>
</svg>'''

    with open('public/brand/zenpaaw-symbol.svg', 'w', encoding='utf-8') as f:
        f.write(symbol_svg)

    # -------------------------------------------------------------
    # B. WORDMARK EXTRACTION
    # -------------------------------------------------------------
    wm_contours, wm_hierarchy = cv2.findContours(white_mask, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_TC89_KCOS)
    # Extract glyphs (parent == -1) and their holes
    glyphs = []
    for i in range(len(wm_contours)):
        if wm_hierarchy[0][i][3] == -1 and cv2.contourArea(wm_contours[i]) > 1000:
            outer_c = wm_contours[i]
            holes = []
            child_idx = wm_hierarchy[0][i][2]
            while child_idx != -1:
                holes.append(wm_contours[child_idx])
                child_idx = wm_hierarchy[0][child_idx][0]
            glyphs.append((outer_c, holes))

    # Sort glyphs left to right
    glyphs.sort(key=lambda g: cv2.boundingRect(g[0])[0])

    # Wordmark bounding box
    all_wm_pts = np.vstack([g[0] for g in glyphs])
    wx, wy, ww, wh = cv2.boundingRect(all_wm_pts)
    wx -= 20; wy -= 20; ww += 40; wh += 40

    wm_paths = []
    for outer_c, holes in glyphs:
        p_d = get_compound_path(outer_c, holes, wx, wy)
        wm_paths.append(f'<path fill-rule="evenodd" d="{p_d}" />')
    wm_inner = "\n    ".join(wm_paths)

    wordmark_white_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {ww} {wh}" fill="none">
  <!-- ZenPaaw Wordmark White -->
  <g fill="#FFFFFF">
    {wm_inner}
  </g>
</svg>'''

    wordmark_teal_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {ww} {wh}" fill="none">
  <!-- ZenPaaw Wordmark Teal -->
  <g fill="#0C534E">
    {wm_inner}
  </g>
</svg>'''

    with open('public/brand/zenpaaw-wordmark-white.svg', 'w', encoding='utf-8') as f:
        f.write(wordmark_white_svg)
    with open('public/brand/zenpaaw-wordmark-teal.svg', 'w', encoding='utf-8') as f:
        f.write(wordmark_teal_svg)

    # -------------------------------------------------------------
    # C. TAGLINE EXTRACTION
    # -------------------------------------------------------------
    tag_contours, tag_hierarchy = cv2.findContours(tagline_mask, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_TC89_KCOS)
    tag_glyphs = []
    for i in range(len(tag_contours)):
        if tag_hierarchy[0][i][3] == -1 and cv2.contourArea(tag_contours[i]) > 300:
            outer_c = tag_contours[i]
            holes = []
            child_idx = tag_hierarchy[0][i][2]
            while child_idx != -1:
                holes.append(tag_contours[child_idx])
                child_idx = tag_hierarchy[0][child_idx][0]
            tag_glyphs.append((outer_c, holes))
    tag_glyphs.sort(key=lambda g: cv2.boundingRect(g[0])[0])

    all_tag_pts = np.vstack([g[0] for g in tag_glyphs])
    tx, ty, tw, th = cv2.boundingRect(all_tag_pts)

    # -------------------------------------------------------------
    # D. STACKED LOCKUP
    # -------------------------------------------------------------
    # Entire lockup bounding box from paw top to tagline bottom
    all_stacked_pts = np.vstack([all_paw_pts, all_wm_pts, all_tag_pts])
    sx, sy, sw, sh = cv2.boundingRect(all_stacked_pts)
    sx -= 40; sy -= 40; sw += 80; sh += 80

    stacked_heel_d = contour_to_svg_path(heel_contour, sx, sy)
    stacked_toe_ol = contour_to_svg_path(toe_outer_left, sx, sy)
    stacked_toe_il = contour_to_svg_path(toe_inner_left, sx, sy)
    stacked_toe_ir = contour_to_svg_path(toe_inner_right, sx, sy)
    stacked_toe_or = contour_to_svg_path(toe_outer_right, sx, sy)

    stacked_wm_paths = []
    for outer_c, holes in glyphs:
        stacked_wm_paths.append(f'<path fill-rule="evenodd" d="{get_compound_path(outer_c, holes, sx, sy)}" />')
    stacked_wm_inner = "\n    ".join(stacked_wm_paths)

    stacked_tag_paths = []
    for outer_c, holes in tag_glyphs:
        stacked_tag_paths.append(f'<path fill-rule="evenodd" d="{get_compound_path(outer_c, holes, sx, sy)}" />')
    stacked_tag_inner = "\n    ".join(stacked_tag_paths)

    stacked_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {sw} {sh}" fill="none">
  <!-- ZenPaaw Stacked Lockup (Symbol + Wordmark + Tagline) -->
  <g id="zenpaaw-symbol" fill="#FFC800">
    <path id="toe-outer-left" d="{stacked_toe_ol}" />
    <path id="toe-inner-left" d="{stacked_toe_il}" />
    <path id="toe-inner-right" d="{stacked_toe_ir}" />
    <path id="toe-outer-right" d="{stacked_toe_or}" />
    <path id="heel-pad" d="{stacked_heel_d}" />
  </g>
  <g id="zenpaaw-wordmark" fill="#FFFFFF">
    {stacked_wm_inner}
  </g>
  <g id="zenpaaw-tagline" fill="#FFC800">
    {stacked_tag_inner}
  </g>
</svg>'''

    with open('public/brand/zenpaaw-lockup-stacked.svg', 'w', encoding='utf-8') as f:
        f.write(stacked_svg)

    # -------------------------------------------------------------
    # E. HORIZONTAL LOCKUP
    # -------------------------------------------------------------
    # Symbol on left, Wordmark on right
    # Scale paw symbol so height matches wordmark (~wh * 1.05)
    scale_factor = wh / ph
    scaled_pw = pw * scale_factor
    spacing = 60
    horiz_w = int(scaled_pw + spacing + ww)
    horiz_h = int(max(wh, scaled_pw))

    horiz_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {horiz_w} {horiz_h}" fill="none">
  <!-- ZenPaaw Horizontal Lockup -->
  <g transform="scale({scale_factor:.4f})" fill="#FFC800">
    <path d="{toe_ol_d}" />
    <path d="{toe_il_d}" />
    <path d="{toe_ir_d}" />
    <path d="{toe_or_d}" />
    <path d="{heel_d}" />
  </g>
  <g transform="translate({int(scaled_pw + spacing)}, 0)" fill="#0C534E">
    {wm_inner}
  </g>
</svg>'''

    with open('public/brand/zenpaaw-horizontal.svg', 'w', encoding='utf-8') as f:
        f.write(horiz_svg)

    # -------------------------------------------------------------
    # F. VERIFY DIFF PERCENTAGE & SAVE logo-diff.png
    # -------------------------------------------------------------
    # Render extracted paths onto canvas matching source dimensions (5435 x 4480)
    canvas = np.full((h, w, 3), [12, 83, 78], dtype=np.uint8) # BGR teal
    # Draw paw
    cv2.drawContours(canvas, [heel_contour, toe_outer_left, toe_inner_left, toe_inner_right, toe_outer_right], -1, (0, 200, 255), -1) # BGR yellow
    # Draw wordmark
    for outer_c, holes in glyphs:
        cv2.drawContours(canvas, [outer_c], -1, (255, 255, 255), -1)
        if holes:
            cv2.drawContours(canvas, holes, -1, (12, 83, 78), -1)
    # Draw tagline
    for outer_c, holes in tag_glyphs:
        cv2.drawContours(canvas, [outer_c], -1, (0, 200, 255), -1)
        if holes:
            cv2.drawContours(canvas, holes, -1, (12, 83, 78), -1)

    # Pixel-by-pixel difference
    diff = cv2.absdiff(img, canvas)
    diff_gray = cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY)
    different_pixels = np.count_nonzero(diff_gray > 40)
    total_pixels = h * w
    diff_percent = (different_pixels / total_pixels) * 100
    print(f"Vector-to-PNG Pixel Difference: {diff_percent:.4f}% (Goal: < 1.0%)")

    # Generate visual difference comparison (side-by-side thumbnail)
    preview_w = 1200
    preview_h = int(h * (preview_w / w))
    orig_small = cv2.resize(img, (preview_w, preview_h))
    canvas_small = cv2.resize(canvas, (preview_w, preview_h))
    diff_small = cv2.resize(diff_gray, (preview_w, preview_h))
    diff_heatmap = cv2.applyColorMap(diff_small, cv2.COLORMAP_JET)

    comp = np.hstack([orig_small, canvas_small, diff_heatmap])
    cv2.imwrite('docs/logo-diff.png', comp)

    # -------------------------------------------------------------
    # G. GENERATE FULL ICON SET
    # -------------------------------------------------------------
    # 1. app/icon.svg (symbol on teal rounded square)
    icon_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <rect width="512" height="512" rx="128" fill="#0C534E"/>
  <g transform="translate(64, 64) scale({384/pw:.4f})" fill="#FFC800">
    <path d="{toe_ol_d}" />
    <path d="{toe_il_d}" />
    <path d="{toe_ir_d}" />
    <path d="{toe_or_d}" />
    <path d="{heel_d}" />
  </g>
</svg>'''
    with open('src/app/icon.svg', 'w', encoding='utf-8') as f:
        f.write(icon_svg)

    # 2. Render PNG icons via Pillow
    # Crop canvas around paw
    paw_canvas = canvas[py:py+ph, px:px+pw]
    paw_rgb = cv2.cvtColor(paw_canvas, cv2.COLOR_BGR2RGB)
    paw_img = Image.fromarray(paw_rgb)

    # Icon base on teal rounded box
    for size, out_path in [
        (180, 'public/apple-icon.png'),
        (192, 'public/icon-192.png'),
        (512, 'public/icon-512.png'),
    ]:
        icon_canvas = Image.new('RGBA', (size, size), (12, 83, 78, 255))
        # resize paw keeping aspect
        p_scaled = paw_img.resize((int(size * 0.75), int(size * 0.75 * (ph/pw))), Image.Resampling.LANCZOS)
        offset = ((size - p_scaled.width) // 2, (size - p_scaled.height) // 2)
        icon_canvas.paste(p_scaled, offset)
        icon_canvas.save(out_path)

    # Favicon.ico
    fav = Image.open('public/icon-192.png')
    fav.resize((32, 32)).save('src/app/favicon.ico', format='ICO')
    fav.resize((32, 32)).save('public/favicon.ico', format='ICO')

    # OpenGraph Image (1200 x 630 on teal background)
    og_img = Image.new('RGB', (1200, 630), (12, 83, 78))
    # Resize canvas content (stacked logo)
    stacked_crop = canvas[sy:sy+sh, sx:sx+sw]
    stacked_rgb = cv2.cvtColor(stacked_crop, cv2.COLOR_BGR2RGB)
    st_img = Image.fromarray(stacked_rgb)
    scale = min(500 / st_img.height, 900 / st_img.width)
    st_scaled = st_img.resize((int(st_img.width * scale), int(st_img.height * scale)), Image.Resampling.LANCZOS)
    og_offset = ((1200 - st_scaled.width) // 2, (630 - st_scaled.height) // 2)
    og_img.paste(st_scaled, og_offset)
    og_img.save('public/opengraph-image.png')
    og_img.save('src/app/opengraph-image.png')

    # Manifest
    manifest = {
        "name": "ZenPaaw - Pet Toy Store",
        "short_name": "ZenPaaw",
        "description": "Durable, enriching toys for dogs and cats. Transparent materials and honest play.",
        "start_url": "/",
        "display": "standalone",
        "background_color": "#FAFBF9",
        "theme_color": "#0C534E",
        "icons": [
            {
                "src": "/icon-192.png",
                "sizes": "192x192",
                "type": "image/png"
            },
            {
                "src": "/icon-512.png",
                "sizes": "512x512",
                "type": "image/png"
            }
        ]
    }
    with open('public/manifest.webmanifest', 'w', encoding='utf-8') as f:
        import json
        json.dump(manifest, f, indent=2)

    print("Brand vector assets and icons successfully generated!")

if __name__ == '__main__':
    main()
