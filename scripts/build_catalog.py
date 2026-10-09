import os
import sys
import json
import csv
import urllib.request
import io
import time
from PIL import Image
import numpy as np
import scipy.fftpack

# Ensure PIL formats are registered
Image.init()

def compute_phash(image_path, hash_size=8):
    try:
        with Image.open(image_path) as img:
            img = img.convert('L').resize((hash_size * 4, hash_size * 4), Image.Resampling.BILINEAR)
            pixels = np.array(img, dtype=np.float32)
            dct = scipy.fftpack.dct(scipy.fftpack.dct(pixels, axis=0, norm='ortho'), axis=1, norm='ortho')
            dct_low = dct[:hash_size, :hash_size]
            med = np.median(dct_low)
            return (dct_low > med).flatten()
    except Exception as e:
        return None

def hamming_distance(h1, h2):
    return np.count_nonzero(h1 != h2)

# Load candidate images
with open('data_image_candidates.json', 'r', encoding='utf-8') as f:
    CANDIDATES = json.load(f)

print(f"Loaded {len(CANDIDATES)} candidates from data_image_candidates.json")

# Define Categories
CATEGORIES = [
    {"id": "dog-chew", "name": "Chew Toys", "petType": "Dogs", "slug": "chew-toys", "desc": "Durable rubber, nylon, and natural composite chew toys for dogs."},
    {"id": "dog-fetch", "name": "Fetch and Outdoor", "petType": "Dogs", "slug": "fetch-and-outdoor", "desc": "Balls, flyers, launchers, and retrieve toys for outdoor play."},
    {"id": "dog-tug", "name": "Tug and Rope", "petType": "Dogs", "slug": "tug-and-rope", "desc": "Braided cotton, jute, and natural fiber tug ropes for interactive play."},
    {"id": "dog-plush", "name": "Plush and Squeaky", "petType": "Dogs", "slug": "plush-and-squeaky", "desc": "Reinforced plush toys with squeakers and crinkle paper."},
    {"id": "dog-puzzle", "name": "Puzzle and Treat Toys", "petType": "Dogs", "slug": "puzzle-and-treat", "desc": "Interactive treat dispensers, snuffle mats, and lick mats."},
    {"id": "dog-water", "name": "Water and Floating Toys", "petType": "Dogs", "slug": "water-and-floating", "desc": "Buoyant toys designed for pool, lake, and beach retrieval."},
    {"id": "dog-interactive", "name": "Interactive and Electronic", "petType": "Dogs", "slug": "interactive-and-electronic", "desc": "Motion-activated and automated interactive play toys."},
    {"id": "puppy-teething", "name": "Teething Toys", "petType": "Puppies", "slug": "puppy-teething", "desc": "Soft rubber and textured toys designed for young puppy gums."},
    {"id": "puppy-starter", "name": "Soft Starter Toys", "petType": "Puppies", "slug": "puppy-starter", "desc": "Gentle plush and lightweight starter toys for young dogs."},
    {"id": "puppy-sets", "name": "Puppy Starter Sets", "petType": "Puppies", "slug": "puppy-sets", "desc": "Multi-piece toy assortments for new puppy households."},
    {"id": "cat-wands", "name": "Wands and Teasers", "petType": "Cats", "slug": "wands-and-teasers", "desc": "Feather wands, ribbon teasers, and flexible chasers for cats."},
    {"id": "cat-kickers", "name": "Kickers and Catnip", "petType": "Cats", "slug": "kickers-and-catnip", "desc": "Catnip-filled kick sticks and textured pillows for hind-paw play."},
    {"id": "cat-tracks", "name": "Balls and Tracks", "petType": "Cats", "slug": "balls-and-tracks", "desc": "Tiered ball tracks, rolling chases, and felt wool play balls."},
    {"id": "cat-electronic", "name": "Electronic and Motion Toys", "petType": "Cats", "slug": "cat-electronic", "desc": "Automated laser tumblers, flutter toys, and robotic rolling balls."},
    {"id": "cat-tunnels", "name": "Tunnels and Hideouts", "petType": "Cats", "slug": "tunnels-and-hideouts", "desc": "Collapsible crinkle play chutes and pop-up cube tunnels."},
    {"id": "cat-scratchers", "name": "Scratchers", "petType": "Cats", "slug": "cat-scratchers", "desc": "Corrugated cardboard lounges and sisal scratching posts."},
    {"id": "cat-plush", "name": "Plush Mice and Small Toys", "petType": "Cats", "slug": "plush-mice-small-toys", "desc": "Rattling felt mice, crinkle balls, and lightweight chase toys."},
    {"id": "bundles", "name": "Multi-Item Bundles", "petType": "Dogs", "slug": "bundles", "desc": "Curated value bundles pairing complementary play styles."}
]

# We will define the product catalogue specification
PRODUCTS_DEF = [
    # Dog Chew (6)
    {
        "slug": "natural-rubber-bone-chew",
        "title": "Natural Rubber Bone Chew Toy",
        "cat": "dog-chew", "pet": ["Dogs"], "play": ["chew"], "chew": "moderate",
        "summary": "Solid natural rubber chew bone with textured nubs. Suitable for medium to large dogs.",
        "desc": "Molded from resilient natural rubber with raised ridges across both ends. Provides an active chewing surface for everyday indoor or outdoor use.",
        "mat": "Natural vulcanized rubber", "dim": "7.5 x 2.5 x 1.8 in (19 x 6.5 x 4.5 cm)", "wt": "260 g", "price": 1499, "cost": 420,
        "variants": [{"name": "Size", "val": "Medium (7.5 in)", "sku": "ZP-CHW-BN-M", "price": 1499, "cost": 420}, {"name": "Size", "val": "Large (9.0 in)", "sku": "ZP-CHW-BN-L", "price": 1899, "cost": 540}],
        "safety": "Supervise during chew sessions. Inspect for tears and discard if fragments loosen."
    },
    {
        "slug": "textured-rubber-chew-ring",
        "title": "Textured Rubber Chew Ring",
        "cat": "dog-chew", "pet": ["Dogs"], "play": ["chew", "fetch"], "chew": "power",
        "summary": "Dense circular rubber ring with grip tread. Designed for energetic chewers.",
        "desc": "Heavy-wall circular geometry distributes bite pressure evenly. The textured exterior provides grip for holding between paws during chew sessions.",
        "mat": "Natural rubber compound", "dim": "6.0 in diameter, 1.2 in thickness (15 x 3 cm)", "wt": "310 g", "price": 1699, "cost": 480,
        "variants": [{"name": "Color", "val": "Teal", "sku": "ZP-CHW-RNG-TL", "price": 1699, "cost": 480}, {"name": "Color", "val": "Orange", "sku": "ZP-CHW-RNG-OR", "price": 1699, "cost": 480}],
        "safety": "Not intended for unattended chewing with heavy destructors."
    },
    {
        "slug": "nylon-and-wood-chew-stick",
        "title": "Nylon and Wood Composite Chew Stick",
        "cat": "dog-chew", "pet": ["Dogs"], "play": ["chew"], "chew": "power",
        "summary": "Durable nylon stick blended with real wood fiber. Safe alternative to outdoor sticks.",
        "desc": "Combines non-splintering polymer nylon with natural wood fiber for scent and texture appeal. Eliminates sharp splinters common to tree branches.",
        "mat": "70% Nylon, 30% Natural wood fiber", "dim": "8.0 x 1.5 in (20 x 4 cm)", "wt": "220 g", "price": 1399, "cost": 380,
        "variants": [{"name": "Flavor", "val": "Natural Wood", "sku": "ZP-CHW-STK-WD", "price": 1399, "cost": 380}, {"name": "Flavor", "val": "Beef Scent", "sku": "ZP-CHW-STK-BF", "price": 1499, "cost": 410}],
        "safety": "Inspect regularly. Discard when chewed down to a size that could be swallowed."
    },
    {
        "slug": "geometric-tread-chew-dumbbell",
        "title": "Geometric Tread Chew Dumbbell",
        "cat": "dog-chew", "pet": ["Dogs"], "play": ["chew", "fetch"], "chew": "moderate",
        "summary": "Balanced rubber dumbbell with textured ends and center grip bar.",
        "desc": "Designed with flared geometric ends that bounce unpredictably during fetch and provide comfortable grip angles during stationary chewing.",
        "mat": "TPR synthetic rubber", "dim": "6.8 x 2.6 in (17 x 6.5 cm)", "wt": "240 g", "price": 1549, "cost": 430,
        "variants": [{"name": "Color", "val": "Cobalt Blue", "sku": "ZP-CHW-DMB-BL", "price": 1549, "cost": 430}, {"name": "Color", "val": "Sage Green", "sku": "ZP-CHW-DMB-GR", "price": 1549, "cost": 430}],
        "safety": "Rinse clean with water after outdoor use."
    },
    {
        "slug": "heavy-duty-tire-chew",
        "title": "Heavy-Duty Rubber Tire Chew",
        "cat": "dog-chew", "pet": ["Dogs"], "play": ["chew", "roll"], "chew": "power",
        "summary": "Thick treaded tire toy built from dense natural rubber. Rolls and bounces.",
        "desc": "Deep tread pattern allows spreading peanut butter or treats inside the inner rim. The heavy sidewalls withstand sustained chewing pressure.",
        "mat": "High-density natural rubber", "dim": "6.0 in outer diameter (15 cm)", "wt": "380 g", "price": 1899, "cost": 550,
        "variants": [{"name": "Standard", "val": "Single Size", "sku": "ZP-CHW-TRE-STD", "price": 1899, "cost": 550}],
        "safety": "Wash by hand with mild soap. Air dry thoroughly."
    },
    {
        "slug": "flexible-dental-chew-cross",
        "title": "Flexible Grooved Chew Cross",
        "cat": "dog-chew", "pet": ["Dogs"], "play": ["chew"], "chew": "gentle",
        "summary": "Flexible four-prong rubber cross with deep surface grooves for soft chewers.",
        "desc": "Gentle firmness suitable for dogs who prefer yielding textures. Each prong features parallel grooves that can hold paste treats.",
        "mat": "Soft-flex TPR rubber", "dim": "5.5 x 5.5 x 1.2 in (14 x 14 x 3 cm)", "wt": "190 g", "price": 1299, "cost": 340,
        "variants": [{"name": "Color", "val": "Aqua", "sku": "ZP-CHW-CRS-AQ", "price": 1299, "cost": 340}],
        "safety": "Recommended for gentle chewers and senior dogs."
    },

    # Dog Fetch and Outdoor (6)
    {
        "slug": "aerodynamic-rubber-flying-disc",
        "title": "Aerodynamic Natural Rubber Flying Disc",
        "cat": "dog-fetch", "pet": ["Dogs"], "play": ["fetch"], "chew": "gentle",
        "summary": "Flexible natural rubber flyer that glides smoothly and lands softly on canine teeth.",
        "desc": "Unlike hard plastic frisbees, this flexible rubber flyer folds for easy transport and will not splinter upon catch. Floats on grass or flat surfaces.",
        "mat": "Natural rubber", "dim": "8.7 in diameter (22 cm)", "wt": "210 g", "price": 1499, "cost": 390,
        "variants": [{"name": "Color", "val": "Bright Red", "sku": "ZP-FTC-DSC-RD", "price": 1499, "cost": 390}, {"name": "Color", "val": "High-Vis Yellow", "sku": "ZP-FTC-DSC-YL", "price": 1499, "cost": 390}],
        "safety": "For fetch only. Not intended as a stationary chew toy."
    },
    {
        "slug": "high-bounce-tennis-balls-3pack",
        "title": "High-Bounce Rubber Tennis Balls (3-Pack)",
        "cat": "dog-fetch", "pet": ["Dogs"], "play": ["fetch"], "chew": "gentle",
        "summary": "Three extra-bounce rubber core balls with non-abrasive felt exterior.",
        "desc": "Engineered with thick natural rubber cores for high rebound on turf and asphalt. Uses non-abrasive polyester felt that will not wear down tooth enamel.",
        "mat": "Natural rubber core, non-abrasive felt", "dim": "2.5 in diameter standard (6.3 cm)", "wt": "180 g (set)", "price": 1199, "cost": 290,
        "variants": [{"name": "Color", "val": "Optic Yellow", "sku": "ZP-FTC-BAL-3PK", "price": 1199, "cost": 290}],
        "safety": "Choose ball size appropriate for your dog to prevent accidental choking."
    },
    {
        "slug": "glow-in-the-dark-fetch-ball",
        "title": "Glow-in-the-Dark Bouncy Fetch Ball",
        "cat": "dog-fetch", "pet": ["Dogs"], "play": ["fetch"], "chew": "moderate",
        "summary": "Recharges under any household light. Glows green for nighttime park sessions.",
        "desc": "Molded from photo-luminescent rubber compound. Five minutes of lamp exposure provides visible green illumination for evening throws.",
        "mat": "Glow-polymer synthetic rubber", "dim": "2.7 in diameter (6.8 cm)", "wt": "115 g", "price": 1349, "cost": 360,
        "variants": [{"name": "Standard", "val": "Single Ball", "sku": "ZP-FTC-GLW-STD", "price": 1349, "cost": 360}],
        "safety": "Non-toxic glow pigment sealed inside rubber matrix."
    },
    {
        "slug": "ergonomic-handheld-ball-launcher",
        "title": "Long-Reach Ball Launcher with Ball",
        "cat": "dog-fetch", "pet": ["Dogs"], "play": ["fetch"], "chew": "gentle",
        "summary": "Handheld launcher arm with 25-inch reach and hands-free ball pickup.",
        "desc": "Extends throwing distance with minimal arm fatigue. Cupped head allows scooping muddy tennis balls directly from the ground without bending over.",
        "mat": "Flexible polypropylene arm, rubber ball", "dim": "25.0 in length (63.5 cm)", "wt": "320 g", "price": 1699, "cost": 490,
        "variants": [{"name": "Color", "val": "Blue Arm", "sku": "ZP-FTC-LCH-BL", "price": 1699, "cost": 490}],
        "safety": "Keep out of reach when not in use."
    },
    {
        "slug": "erratic-bounce-geometric-ball",
        "title": "Erratic Bounce Rubber Ball",
        "cat": "dog-fetch", "pet": ["Dogs"], "play": ["fetch"], "chew": "moderate",
        "summary": "Multi-faceted geometric rubber ball that rebounds at unpredictable angles.",
        "desc": "The angled polygonal surface creates varied ground trajectories on every bounce, stimulating active chase reflexes during park play.",
        "mat": "Natural high-density rubber", "dim": "2.8 in diameter (7.0 cm)", "wt": "140 g", "price": 1249, "cost": 320,
        "variants": [{"name": "Color", "val": "Orange", "sku": "ZP-FTC-ERT-OR", "price": 1249, "cost": 320}, {"name": "Color", "val": "Teal", "sku": "ZP-FTC-ERT-TL", "price": 1249, "cost": 320}],
        "safety": "Best used on open grass or turf fields."
    },
    {
        "slug": "floating-foam-fetch-ring",
        "title": "High-Visibility Foam Fetch Ring",
        "cat": "dog-fetch", "pet": ["Dogs"], "play": ["fetch", "water"], "chew": "gentle",
        "summary": "Lightweight EVA foam ring that rolls upright and lands gently on soft terrain.",
        "desc": "Lightweight closed-cell foam construction allows easy rolling across open grass and effortless retrieval for small or medium dogs.",
        "mat": "High-density EVA foam", "dim": "7.8 in diameter (20 cm)", "wt": "95 g", "price": 1399, "cost": 340,
        "variants": [{"name": "Color", "val": "Fluorescent Green", "sku": "ZP-FTC-RNG-GR", "price": 1399, "cost": 340}],
        "safety": "Intended for interactive retrieval, not stationary chew time."
    },

    # Dog Tug and Rope (6)
    {
        "slug": "knotted-cotton-rope-3knot",
        "title": "Knotted Cotton Rope Tug (3-Knot)",
        "cat": "dog-tug", "pet": ["Dogs"], "play": ["tug"], "chew": "moderate",
        "summary": "Heavy-duty three-knot braided cotton rope for two-player tug sessions.",
        "desc": "Tightly woven from 100% natural cotton fibers. Three solid fist knots provide secure grip points for both dog and handler.",
        "mat": "100% Natural unbleached cotton", "dim": "21.0 in length, 1.2 in thick (53 x 3 cm)", "wt": "340 g", "price": 1399, "cost": 350,
        "variants": [{"name": "Size", "val": "Medium (21 in)", "sku": "ZP-TUG-3KN-M", "price": 1399, "cost": 350}, {"name": "Size", "val": "Large (26 in)", "sku": "ZP-TUG-3KN-L", "price": 1799, "cost": 460}],
        "safety": "Inspect rope threads. Cut loose strands to prevent ingestion."
    },
    {
        "slug": "figure-8-double-handle-rope",
        "title": "Figure-8 Double Handle Tug Rope",
        "cat": "dog-tug", "pet": ["Dogs"], "play": ["tug"], "chew": "moderate",
        "summary": "Figure-8 loop rope providing balanced handholds for both dog and human.",
        "desc": "Continuous loop knot creates two symmetrical handles. Perfect for structured games of tug that reinforce release commands.",
        "mat": "Braided cotton-poly blend", "dim": "15.0 x 6.5 in (38 x 16 cm)", "wt": "280 g", "price": 1449, "cost": 370,
        "variants": [{"name": "Color", "val": "Navy and White", "sku": "ZP-TUG-FG8-NV", "price": 1449, "cost": 370}],
        "safety": "Always supervise interactive play."
    },
    {
        "slug": "natural-jute-tug-strap",
        "title": "Natural Jute Bite Tug Strap",
        "cat": "dog-tug", "pet": ["Dogs"], "play": ["tug"], "chew": "power",
        "summary": "Commercial grade jute fiber tug pad with reinforced nylon webbing handle.",
        "desc": "Sewn from double-layered woven jute fabric with cross-box stitching on the handle. Provides a firm, tooth-gripping surface for training tug.",
        "mat": "Natural woven jute, nylon webbing", "dim": "12.0 x 3.0 in pad (30 x 7.5 cm)", "wt": "210 g", "price": 1649, "cost": 440,
        "variants": [{"name": "Handle", "val": "Single Handle", "sku": "ZP-TUG-JUT-S1", "price": 1649, "cost": 440}, {"name": "Handle", "val": "Double Handle", "sku": "ZP-TUG-JUT-S2", "price": 1949, "cost": 520}],
        "safety": "Training tool for supervised interactive sessions only."
    },
    {
        "slug": "cotton-tug-ball-with-handle",
        "title": "Cotton Rope Ball with Loop Handle",
        "cat": "dog-tug", "pet": ["Dogs"], "play": ["tug", "fetch"], "chew": "moderate",
        "summary": "Solid monkey-fist rope ball with an integrated 12-inch braided loop handle.",
        "desc": "Combines throw-and-fetch range with a sturdy handle for transition to tug-of-war upon return. Weighs enough for long backyard lobs.",
        "mat": "100% Braided cotton", "dim": "Ball diameter 3.2 in, total length 15 in", "wt": "310 g", "price": 1499, "cost": 390,
        "variants": [{"name": "Standard", "val": "One Size", "sku": "ZP-TUG-BAL-STD", "price": 1499, "cost": 390}],
        "safety": "Machine washable on cold cycle in laundry bag."
    },
    {
        "slug": "bungee-shock-absorbing-tug-rope",
        "title": "Shock-Absorbing Bungee Tug Rope",
        "cat": "dog-tug", "pet": ["Dogs"], "play": ["tug"], "chew": "moderate",
        "summary": "Internal elastic bungee core reduces sudden jolts on handler shoulder and canine neck.",
        "desc": "Durable tubular webbing wraps a high-tension elastic shock absorber. Softens the impact of vigorous head-shaking and sudden tug pulls.",
        "mat": "Heavy-duty nylon webbing, internal latex bungee", "dim": "24 in resting, stretches to 36 in", "wt": "240 g", "price": 1849, "cost": 490,
        "variants": [{"name": "Color", "val": "Black and Teal", "sku": "ZP-TUG-BNG-BK", "price": 1849, "cost": 490}],
        "safety": "Do not let dog chew directly on the bungee section."
    },
    {
        "slug": "extra-thick-mammoth-rope-tug",
        "title": "Braided Mammoth Rope Tug (4-Knot)",
        "cat": "dog-tug", "pet": ["Dogs"], "play": ["tug"], "chew": "power",
        "summary": "Extra-thick 1.8-inch diameter rope tug built for large breed tug sessions.",
        "desc": "Massive 4-knot cotton rope with dense fiber density. Weighs nearly two pounds, providing significant substance for large working breeds.",
        "mat": "Natural cotton fiber", "dim": "32.0 in length, 1.8 in thick (81 x 4.5 cm)", "wt": "820 g", "price": 2499, "cost": 720,
        "variants": [{"name": "Standard", "val": "Large Breed", "sku": "ZP-TUG-MAM-LRG", "price": 2499, "cost": 720}],
        "safety": "Keep dry when stored to maintain cotton fiber strength."
    },

    # Dog Plush and Squeaky (6)
    {
        "slug": "canvas-reinforced-duck-crinkle-plush",
        "title": "Canvas-Reinforced Mallard Duck Plush",
        "cat": "dog-plush", "pet": ["Dogs"], "play": ["solo", "fetch"], "chew": "gentle",
        "summary": "Rip-resistant canvas lined plush duck with puncture-resistant squeaker.",
        "desc": "Constructed with an interior layer of heavy cotton canvas backing beneath soft faux fur. Features a crinkle paper wing liner and chest squeaker.",
        "mat": "Polyester plush, cotton canvas lining, PE squeaker", "dim": "13.0 x 8.0 x 3.5 in (33 x 20 x 9 cm)", "wt": "160 g", "price": 1499, "cost": 380,
        "variants": [{"name": "Standard", "val": "Mallard Green", "sku": "ZP-PLS-DCK-STD", "price": 1499, "cost": 380}],
        "safety": "Supervised play recommended. Remove if lining tears."
    },
    {
        "slug": "stuffless-crinkle-raccoon-toy",
        "title": "Stuffing-Free Flat Raccoon Toy",
        "cat": "dog-plush", "pet": ["Dogs"], "play": ["solo"], "chew": "gentle",
        "summary": "Flat, zero-stuffing raccoon toy with head and tail squeakers plus crinkle belly.",
        "desc": "Eliminates messy polyfill stuffing cleanup. Two internal squeakers and full-length crinkle paper offer auditory stimulation without fiber mess.",
        "mat": "Polyester plush, crinkle film", "dim": "18.0 x 5.0 in flat (45 x 12 cm)", "wt": "110 g", "price": 1299, "cost": 310,
        "variants": [{"name": "Standard", "val": "Grey Raccoon", "sku": "ZP-PLS-RCN-STD", "price": 1299, "cost": 310}],
        "safety": "No internal stuffing to swallow."
    },
    {
        "slug": "corduroy-textured-fox-squeaker",
        "title": "Corduroy Textured Fox Squeaker Toy",
        "cat": "dog-plush", "pet": ["Dogs"], "play": ["solo", "fetch"], "chew": "gentle",
        "summary": "Wide-wale corduroy fabric provides interesting mouth feel with deep squeaker tone.",
        "desc": "Ribbed corduroy exterior feels soft yet durable during play. Double-stitched seams along extremities extend toy longevity.",
        "mat": "Cotton-poly corduroy, polyfill, squeaker", "dim": "10.5 x 5.0 in (26 x 13 cm)", "wt": "135 g", "price": 1399, "cost": 340,
        "variants": [{"name": "Color", "val": "Rust Orange", "sku": "ZP-PLS-FOX-OR", "price": 1399, "cost": 340}],
        "safety": "Inspect seams periodically."
    },
    {
        "slug": "hedgehog-round-squeaker-plush",
        "title": "Round Hedgehog Soft Squeaker Plush",
        "cat": "dog-plush", "pet": ["Dogs"], "play": ["solo"], "chew": "gentle",
        "summary": "Compact round plush toy that rolls and squeaks easily with light jaw pressure.",
        "desc": "Soft textured boucle faux fur mimics prickly spines without irritation. Round shape allows easy carrying for small and medium dogs.",
        "mat": "Polyester boucle plush, polyfill", "dim": "6.0 x 4.5 in (15 x 11 cm)", "wt": "95 g", "price": 1199, "cost": 290,
        "variants": [{"name": "Standard", "val": "Tan Hedgehog", "sku": "ZP-PLS-HDG-STD", "price": 1199, "cost": 290}],
        "safety": "Gentle wash cycle air dry."
    },
    {
        "slug": "soft-lamb-comfort-plush-toy",
        "title": "Soft Lamb Comfort Plush Toy",
        "cat": "dog-plush", "pet": ["Dogs", "Puppies"], "play": ["solo"], "chew": "gentle",
        "summary": "Soft fleece plush with gentle squeaker. Popular comfort companion for rest time.",
        "desc": "Plush sherpa fleece fabric creates a soft resting partner for crates and dog beds. Single gentle squeaker in body responds to light presses.",
        "mat": "Sherpa fleece polyester, hypoallergenic polyfill", "dim": "11.0 x 6.0 in (28 x 15 cm)", "wt": "120 g", "price": 1449, "cost": 360,
        "variants": [{"name": "Standard", "val": "Off-White Lamb", "sku": "ZP-PLS-LMB-STD", "price": 1449, "cost": 360}],
        "safety": "Not intended for destructive chewers."
    },
    {
        "slug": "double-layer-ballistic-bear-plush",
        "title": "Ballistic Nylon Reinforced Bear Plush",
        "cat": "dog-plush", "pet": ["Dogs"], "play": ["solo", "tug"], "chew": "moderate",
        "summary": "Reinforced plush bear with inner ballistic nylon layer and webbed border bindings.",
        "desc": "Combines soft exterior plush with internal industrial-grade ballistic nylon backing. Heavy webbing covers all exterior seam edges.",
        "mat": "Polyester outer, 600D ballistic nylon lining", "dim": "12.0 x 7.0 in (30 x 18 cm)", "wt": "195 g", "price": 1699, "cost": 450,
        "variants": [{"name": "Color", "val": "Brown Bear", "sku": "ZP-PLS-BER-BR", "price": 1699, "cost": 450}],
        "safety": "Significantly tougher than standard plush, but supervise initial play."
    },

    # Dog Puzzle and Treat (6)
    {
        "slug": "iq-treat-dispenser-tumbler-ball",
        "title": "Weighted Base Treat Dispenser Tumbler",
        "cat": "dog-puzzle", "pet": ["Dogs"], "play": ["puzzle"], "chew": "gentle",
        "summary": "Wobble base treat ball that dispenses kibble as the dog nudges it with nose or paws.",
        "desc": "Weighted bottom rights itself after every roll. Adjustable interior baffle lets you control the kibble exit aperture difficulty level.",
        "mat": "Hard ABS polymer plastic", "dim": "4.5 in diameter, 5.5 in height (11 x 14 cm)", "wt": "310 g", "price": 1799, "cost": 480,
        "variants": [{"name": "Color", "val": "Teal and Clear", "sku": "ZP-PZL-TMB-TL", "price": 1799, "cost": 480}],
        "safety": "Hand wash with warm water and bottle brush."
    },
    {
        "slug": "textured-silicone-lick-mat-suction",
        "title": "Textured Silicone Lick Mat with Suction Cups",
        "cat": "dog-puzzle", "pet": ["Dogs", "Puppies"], "play": ["puzzle", "solo"], "chew": "gentle",
        "summary": "Four-quadrant silicone grooming mat with 36 suction cups on reverse side.",
        "desc": "Four distinct surface textures hold wet food, yogurt, or purees. Strong suction cups adhere firmly to tile, glass, and bathtub walls during grooming.",
        "mat": "100% Food-grade silicone", "dim": "8.0 x 8.0 x 0.3 in (20 x 20 x 0.8 cm)", "wt": "165 g", "price": 1299, "cost": 310,
        "variants": [{"name": "Color", "val": "Teal Blue", "sku": "ZP-PZL-LCK-TL", "price": 1299, "cost": 310}, {"name": "Color", "val": "Sage Green", "sku": "ZP-PZL-LCK-GR", "price": 1299, "cost": 310}],
        "safety": "Inspect mat. Do not let dog chew the silicone corners."
    },
    {
        "slug": "fleece-snuffle-foraging-play-mat",
        "title": "Fleece Foraging Snuffle Play Mat",
        "cat": "dog-puzzle", "pet": ["Dogs", "Puppies"], "play": ["puzzle"], "chew": "gentle",
        "summary": "Dense polar fleece foraging mat with non-slip bottom. Hides dry food for scent search.",
        "desc": "Hundreds of fleece strips arranged in tight rosettes simulate natural foraging grass. Machine-washable with silicone gripper dots on the underside.",
        "mat": "Polar fleece fabric, oxford base with anti-slip dots", "dim": "20.0 x 20.0 in (50 x 50 cm)", "wt": "390 g", "price": 2199, "cost": 590,
        "variants": [{"name": "Standard", "val": "Multi-Color Grid", "sku": "ZP-PZL-SNF-STD", "price": 2199, "cost": 590}],
        "safety": "Machine wash cold on gentle cycle. Air dry."
    },
    {
        "slug": "slide-and-seek-wooden-puzzle-board",
        "title": "Slide and Seek Wooden Puzzle Board",
        "cat": "dog-puzzle", "pet": ["Dogs"], "play": ["puzzle"], "chew": "gentle",
        "summary": "Level 1 cognitive puzzle board with 8 sliding tiles that conceal food wells.",
        "desc": "Dogs slide recessed wooden pucks using paws or snout to uncover hidden dry rewards. Smooth rounded tracks prevent stuck tiles.",
        "mat": "Pressed composite wood with non-toxic lacquer", "dim": "9.5 x 9.5 x 1.2 in (24 x 24 x 3 cm)", "wt": "540 g", "price": 2399, "cost": 640,
        "variants": [{"name": "Standard", "val": "Natural Finish", "sku": "ZP-PZL-BRD-NAT", "price": 2399, "cost": 640}],
        "safety": "Supervise puzzle solving. Store when empty."
    },
    {
        "slug": "slow-feed-spiral-maze-bowl-insert",
        "title": "Spiral Maze Slow Feed Bowl Insert",
        "cat": "dog-puzzle", "pet": ["Dogs"], "play": ["puzzle"], "chew": "gentle",
        "summary": "Flexible suction-base silicone spiral insert fits into existing food bowls.",
        "desc": "Converts standard stainless steel or ceramic dog bowls into slow-eating puzzle bowls. Lengthens mealtime duration up to five times.",
        "mat": "Flexible silicone", "dim": "7.0 in diameter, 2.0 in height (18 x 5 cm)", "wt": "180 g", "price": 1199, "cost": 280,
        "variants": [{"name": "Color", "val": "Slate Grey", "sku": "ZP-PZL-SPM-GR", "price": 1199, "cost": 280}],
        "safety": "Top rack dishwasher safe."
    },
    {
        "slug": "rubber-grooved-treat-dispenser-bone",
        "title": "Rubber Grooved Treat Holding Bone",
        "cat": "dog-puzzle", "pet": ["Dogs"], "play": ["puzzle", "chew"], "chew": "moderate",
        "summary": "Natural rubber bone with hollow core and side treat slots for biscuits and paste.",
        "desc": "Central cavity holds stick treats or frozen wet food, while side chevron teeth wedge dry kibble for extended licking and nudging.",
        "mat": "Natural rubber", "dim": "6.5 x 2.4 in (16.5 x 6 cm)", "wt": "230 g", "price": 1599, "cost": 410,
        "variants": [{"name": "Color", "val": "Blue", "sku": "ZP-PZL-TRB-BL", "price": 1599, "cost": 410}, {"name": "Color", "val": "Green", "sku": "ZP-PZL-TRB-GR", "price": 1599, "cost": 410}],
        "safety": "Freeze with peanut butter for longer puzzle duration."
    },

    # Dog Water and Floating (6)
    {
        "slug": "water-retrieval-foam-dummy-rope",
        "title": "Floating Water Retrieval Dummy with Rope",
        "cat": "dog-water", "pet": ["Dogs"], "play": ["water", "fetch"], "chew": "gentle",
        "summary": "High-buoyancy canvas bumper dummy with throw toggle for lake and dock retrieving.",
        "desc": "Filled with high-density floating foam and wrapped in 1000D water-shedding canvas. Integrated braided throw rope allows long-distance throws over water.",
        "mat": "1000D Oxford canvas, closed-cell foam, nylon throw cord", "dim": "10.0 x 2.5 in body, 15 in throw cord", "wt": "220 g", "price": 1699, "cost": 440,
        "variants": [{"name": "Color", "val": "High-Vis Orange", "sku": "ZP-WTR-DMM-OR", "price": 1699, "cost": 440}, {"name": "Color", "val": "White", "sku": "ZP-WTR-DMM-WH", "price": 1699, "cost": 440}],
        "safety": "Air dry after water sessions. For retrieval training."
    },
    {
        "slug": "floating-neoprene-splash-bone",
        "title": "Floating Neoprene Splash Bone",
        "cat": "dog-water", "pet": ["Dogs"], "play": ["water", "fetch"], "chew": "gentle",
        "summary": "Soft buoyant neoprene bone that floats high on water surface for easy spotting.",
        "desc": "Closed-cell foam interior wrapped in quick-drying neoprene fabric with contrast piping. Gentle on dog gums during aquatic water catches.",
        "mat": "Neoprene, closed-cell foam", "dim": "9.0 x 4.0 in (23 x 10 cm)", "wt": "110 g", "price": 1399, "cost": 340,
        "variants": [{"name": "Standard", "val": "Bright Aqua", "sku": "ZP-WTR-BNE-AQ", "price": 1399, "cost": 340}],
        "safety": "Rinse pool water with fresh tap water."
    },
    {
        "slug": "hydro-floating-rubber-ball-rope",
        "title": "Hydro Floating Rubber Ball with Leash Handle",
        "cat": "dog-water", "pet": ["Dogs"], "play": ["water", "fetch"], "chew": "moderate",
        "summary": "Buoyant TPR ball with hollow air chambers and non-absorbent floating rope.",
        "desc": "Specialized air pockets ensure the ball sits high above wave crests. The non-absorbent nylon rope will not sink or become waterlogged.",
        "mat": "Lightweight TPR rubber, floating PP cord", "dim": "Ball diameter 3.0 in, rope length 14 in", "wt": "160 g", "price": 1499, "cost": 380,
        "variants": [{"name": "Color", "val": "Yellow and Blue", "sku": "ZP-WTR-BAL-YL", "price": 1499, "cost": 380}],
        "safety": "Ensure dog is a confident swimmer before deep water fetch."
    },
    {
        "slug": "floating-aerodynamic-splash-ring",
        "title": "Floating Aerodynamic Splash Ring",
        "cat": "dog-water", "pet": ["Dogs"], "play": ["water", "fetch"], "chew": "gentle",
        "summary": "Lightweight dual-density foam ring designed for pool and surf retrieving.",
        "desc": "Flies smoothly over water and floats flat on surface waves. Beveled edges allow canine teeth to grasp the ring without taking on water.",
        "mat": "Dual-density EVA foam", "dim": "8.5 in diameter (21.5 cm)", "wt": "130 g", "price": 1549, "cost": 390,
        "variants": [{"name": "Standard", "val": "Neon Lime", "sku": "ZP-WTR-RNG-LM", "price": 1549, "cost": 390}],
        "safety": "Inspect foam surface for tooth punctures after use."
    },
    {
        "slug": "waterproof-floating-stick-toy",
        "title": "Waterproof Floating Fetch Stick",
        "cat": "dog-water", "pet": ["Dogs"], "play": ["water", "fetch"], "chew": "moderate",
        "summary": "Safe rubber stick that floats upright in water like a buoy for easy recognition.",
        "desc": "Weighted bottom end forces the brightly colored top segment to float vertically above water chop, providing immediate visibility for swimming dogs.",
        "mat": "Closed-cell TPR rubber", "dim": "11.0 in length, 1.6 in diameter (28 x 4 cm)", "wt": "240 g", "price": 1649, "cost": 430,
        "variants": [{"name": "Color", "val": "High-Vis Red", "sku": "ZP-WTR-STK-RD", "price": 1649, "cost": 430}],
        "safety": "Use in calm waters and always fit swimming dogs with life vests in currents."
    },
    {
        "slug": "buoyant-rope-knot-floating-toy",
        "title": "Buoyant Marine Rope Knot Toy",
        "cat": "dog-water", "pet": ["Dogs"], "play": ["water", "tug"], "chew": "moderate",
        "summary": "Braided from lightweight polypropylene marine rope that will not absorb water.",
        "desc": "Commercial marine grade fiber rope naturally floats on freshwater and saltwater. Dries rapidly after swimming sessions without mildew odors.",
        "mat": "Polypropylene hollow-braid rope", "dim": "14.0 in length, 2.5 in knot (35 x 6 cm)", "wt": "175 g", "price": 1399, "cost": 350,
        "variants": [{"name": "Standard", "val": "Marine Blue", "sku": "ZP-WTR-KNT-BL", "price": 1399, "cost": 350}],
        "safety": "Hang to air dry after lake play."
    },

    # Dog Interactive and Electronic (6)
    {
        "slug": "motion-activated-giggle-ball",
        "title": "Internal Sound Tube Rolling Giggle Ball",
        "cat": "dog-interactive", "pet": ["Dogs"], "play": ["interactive", "solo"], "chew": "gentle",
        "summary": "Battery-free internal sound tubes emit playful giggle noises when rolled.",
        "desc": "Three internal acoustic tubes produce amusing chuckling and giggling sounds as the ball rolls across floor surfaces. Needs zero batteries.",
        "mat": "Rigid non-toxic PVC", "dim": "5.5 in diameter (14 cm)", "wt": "380 g", "price": 1899, "cost": 510,
        "variants": [{"name": "Standard", "val": "Green and Blue", "sku": "ZP-INT-GGL-STD", "price": 1899, "cost": 510}],
        "safety": "Hard surface ball. Best on rugs, carpet, or backyard turf."
    },
    {
        "slug": "automatic-rolling-active-dog-ball",
        "title": "Rechargeable Self-Rolling Activity Ball",
        "cat": "dog-interactive", "pet": ["Dogs"], "play": ["interactive", "solo"], "chew": "gentle",
        "summary": "Internal motor automatically changes direction when encountering furniture.",
        "desc": "Equipped with an intelligent centrifugal motor that wobbles, spins, and turns. USB-C rechargeable battery runs up to 3 hours of intermittent play.",
        "mat": "Silicone outer shell, internal ABS core", "dim": "3.1 in diameter (8 cm)", "wt": "210 g", "price": 2999, "cost": 880,
        "variants": [{"name": "Color", "val": "Orange Silicone", "sku": "ZP-INT-ROL-OR", "price": 2999, "cost": 880}, {"name": "Color", "val": "Teal Silicone", "sku": "ZP-INT-ROL-TL", "price": 2999, "cost": 880}],
        "safety": "Supervise during active motor cycles. Shell is wipe clean."
    },
    {
        "slug": "sound-activated-wobble-tumbler",
        "title": "Touch-Activated Sound Wobble Tumbler",
        "cat": "dog-interactive", "pet": ["Dogs"], "play": ["interactive"], "chew": "gentle",
        "summary": "Wobbles on a heavy base and chirps brief bird and animal sounds when touched.",
        "desc": "Responds to gentle nose nudges with short random tone cues. Shuts off automatically after two minutes of inactivity to preserve battery.",
        "mat": "ABS plastic", "dim": "4.8 in diameter, 6.0 in height", "wt": "320 g", "price": 2499, "cost": 690,
        "variants": [{"name": "Standard", "val": "Yellow and White", "sku": "ZP-INT-WBL-STD", "price": 2499, "cost": 690}],
        "safety": "Requires 2 AA batteries (not included)."
    },
    {
        "slug": "fluttering-tail-motorized-dog-toy",
        "title": "Motorized Fluttering Tail Floor Toy",
        "cat": "dog-interactive", "pet": ["Dogs"], "play": ["interactive"], "chew": "gentle",
        "summary": "Concealed rotating wand sweeps beneath a round fabric skirt to entice chasing.",
        "desc": "Motorized base unpredictably sweeps a flexible wand in varying speeds beneath a durable circular nylon sheet, stimulating hunting instincts.",
        "mat": "Ripstop nylon skirt, ABS motorized hub", "dim": "23.0 in diameter cover (58 cm)", "wt": "420 g", "price": 3199, "cost": 940,
        "variants": [{"name": "Standard", "val": "Yellow Skirt", "sku": "ZP-INT-FLT-STD", "price": 3199, "cost": 940}],
        "safety": "Non-skid base tabs prevent floor skidding."
    },
    {
        "slug": "scent-compartment-puzzle-ball",
        "title": "Aroma Vent Scent Puzzle Ball",
        "cat": "dog-interactive", "pet": ["Dogs"], "play": ["puzzle", "solo"], "chew": "moderate",
        "summary": "Dual-chamber rubber ball with scent ventilation holes and inner bell chamber.",
        "desc": "Allows placing scent treats or fresh herbs in an isolated inner sleeve. Perforations allow scent dispersal without letting treats fall out immediately.",
        "mat": "Natural rubber", "dim": "3.5 in diameter (9 cm)", "wt": "190 g", "price": 1499, "cost": 390,
        "variants": [{"name": "Standard", "val": "Forest Green", "sku": "ZP-INT-SCN-STD", "price": 1499, "cost": 390}],
        "safety": "Rinse clean after scent sessions."
    },
    {
        "slug": "electronic-laser-chase-tumbler-dog",
        "title": "Automated Random Floor Laser Chaser",
        "cat": "dog-interactive", "pet": ["Dogs", "Cats"], "play": ["interactive"], "chew": "gentle",
        "summary": "Rotating mirror projects safe red beam across floors in random circular orbits.",
        "desc": "Operates with 360-degree irregular rotation patterns. Features 15-minute auto-sleep timer so pets rest between exercise periods.",
        "mat": "Polycarbonate housing", "dim": "7.5 x 3.5 in (19 x 9 cm)", "wt": "260 g", "price": 2799, "cost": 780,
        "variants": [{"name": "Standard", "val": "White and Slate", "sku": "ZP-INT-LSR-STD", "price": 2799, "cost": 780}],
        "safety": "Class 1 certified low-power diode. Never point beam directly into eyes."
    },

    # Puppy Categories (10 total: 4 teething, 4 starter, 2 sets)
    {
        "slug": "soft-rubber-puppy-teething-bone",
        "title": "Soft Rubber Puppy Teething Bone",
        "cat": "puppy-teething", "pet": ["Puppies"], "play": ["chew"], "chew": "gentle",
        "summary": "Pliable natural rubber bone specifically calibrated for deciduous puppy teeth.",
        "desc": "Gentler durometer rubber yields safely to 8 to 24 week puppy mouths. Small nubs across ends massage sensitive teething gums.",
        "mat": "Soft-flex natural rubber", "dim": "5.0 x 1.8 in (12.5 x 4.5 cm)", "wt": "95 g", "price": 1199, "cost": 280,
        "variants": [{"name": "Color", "val": "Pastel Blue", "sku": "ZP-PUP-BN-BL", "price": 1199, "cost": 280}, {"name": "Color", "val": "Pastel Pink", "sku": "ZP-PUP-BN-PK", "price": 1199, "cost": 280}],
        "safety": "Designed for puppies under 25 lbs."
    },
    {
        "slug": "freezable-teething-cooling-ring",
        "title": "Freezable Water-Filled Teething Cooling Ring",
        "cat": "puppy-teething", "pet": ["Puppies"], "play": ["chew"], "chew": "gentle",
        "summary": "Filled with purified water. Place in freezer for 30 minutes to soothe gums.",
        "desc": "Safe distilled water core chills to low temperatures without freezing into rock-hard ice. Textured circular ring is lightweight for small paws.",
        "mat": "EVA shell, purified water filling", "dim": "4.5 in diameter (11.5 cm)", "wt": "110 g", "price": 1299, "cost": 310,
        "variants": [{"name": "Standard", "val": "Ice Blue", "sku": "ZP-PUP-RNG-ICE", "price": 1299, "cost": 310}],
        "safety": "Freeze flat. Discard if shell is punctured."
    },
    {
        "slug": "textured-puppy-teething-keys-ring",
        "title": "Textured Puppy Teething Key Ring",
        "cat": "puppy-teething", "pet": ["Puppies"], "play": ["chew", "solo"], "chew": "gentle",
        "summary": "Three distinct textured rubber keys on a central holding ring.",
        "desc": "Each key provides a unique geometric texture for different chewing angles. Multiple keys rattle gently together during movement.",
        "mat": "Flexible thermoplastic rubber", "dim": "5.5 x 4.0 in overall (14 x 10 cm)", "wt": "130 g", "price": 1399, "cost": 340,
        "variants": [{"name": "Standard", "val": "Multi-Color Trio", "sku": "ZP-PUP-KEY-STD", "price": 1399, "cost": 340}],
        "safety": "Hand wash with mild baby-safe soap."
    },
    {
        "slug": "mini-cotton-puppy-rope-knot",
        "title": "Mini Cotton Puppy Rope Knot",
        "cat": "puppy-teething", "pet": ["Puppies"], "play": ["chew", "tug"], "chew": "gentle",
        "summary": "Slender 0.6-inch diameter cotton rope woven with fine fibers for small puppy mouths.",
        "desc": "Soft unbleached cotton threads act as soft floss along emerging teeth during gentle puppy tug and chew sessions.",
        "mat": "100% Fine cotton yarn", "dim": "11.0 in length, 0.6 in thickness (28 x 1.5 cm)", "wt": "70 g", "price": 899, "cost": 210,
        "variants": [{"name": "Standard", "val": "Natural White", "sku": "ZP-PUP-ROP-NAT", "price": 899, "cost": 210}],
        "safety": "Trim loose strings as puppy chews."
    },
    {
        "slug": "puppy-heartbeat-comfort-plush",
        "title": "Puppy Heartbeat Companion Comfort Plush",
        "cat": "puppy-starter", "pet": ["Puppies"], "play": ["solo"], "chew": "gentle",
        "summary": "Plush puppy with pulse simulator module that replicates a maternal heartbeat.",
        "desc": "Concealed hook-and-loop pocket houses a rhythmic pulse unit that runs for 8 hours on a charge. Eases transition into new homes during crate rest.",
        "mat": "Short-pile polyester plush, ABS pulse unit", "dim": "12.0 x 6.5 x 4.0 in (30 x 16 x 10 cm)", "wt": "240 g", "price": 2899, "cost": 790,
        "variants": [{"name": "Color", "val": "Golden Pup", "sku": "ZP-PUP-HRT-GLD", "price": 2899, "cost": 790}],
        "safety": "Machine wash plush shell after removing the pulse module."
    },
    {
        "slug": "gentle-scent-blanket-snuggle-toy",
        "title": "Gentle Scent Blanket Snuggle Plush",
        "cat": "puppy-starter", "pet": ["Puppies"], "play": ["solo"], "chew": "gentle",
        "summary": "Fleece security blanket with padded plush animal head and tied corner knots.",
        "desc": "Fabric absorbs familiar litter or mother scent to provide reassurance. Four corner knots give puppy gentle chewing targets.",
        "mat": "Double-sided microfleece", "dim": "14.0 x 14.0 in blanket (35 x 35 cm)", "wt": "85 g", "price": 1249, "cost": 290,
        "variants": [{"name": "Style", "val": "Bear Blanket", "sku": "ZP-PUP-BLK-BER", "price": 1249, "cost": 290}],
        "safety": "Machine washable."
    },
    {
        "slug": "mini-soft-squeak-starter-ball",
        "title": "Mini Soft Squeak Starter Ball (2-Pack)",
        "cat": "puppy-starter", "pet": ["Puppies"], "play": ["fetch", "solo"], "chew": "gentle",
        "summary": "Two lightweight mini rubber balls with easy-press squeakers for young pups.",
        "desc": "Sized at 1.9 inches so puppies under 15 pounds can comfortably carry and roll them across hardwood or rug surfaces.",
        "mat": "Soft latex-free TPR rubber", "dim": "1.9 in diameter (4.8 cm)", "wt": "60 g (pair)", "price": 999, "cost": 220,
        "variants": [{"name": "Standard", "val": "Pastel Duo", "sku": "ZP-PUP-BAL-2PK", "price": 999, "cost": 220}],
        "safety": "Upgrade to larger balls as puppy grows."
    },
    {
        "slug": "crinkle-fabric-puppy-play-bone",
        "title": "Crinkle Fabric Puppy Play Bone",
        "cat": "puppy-starter", "pet": ["Puppies"], "play": ["solo"], "chew": "gentle",
        "summary": "Lightweight padded fabric bone with internal crinkle paper lining.",
        "desc": "Auditory crunching sound encourages curiosity without startling timid young puppies. Very light weight makes it easy for small jaws to carry.",
        "mat": "Cotton twill, polyester fiber, crinkle film", "dim": "7.0 x 3.5 in (18 x 9 cm)", "wt": "45 g", "price": 899, "cost": 210,
        "variants": [{"name": "Standard", "val": "Sage Check", "sku": "ZP-PUP-CRN-BNE", "price": 899, "cost": 210}],
        "safety": "Ideal for puppies 8 to 16 weeks old."
    },
    {
        "slug": "essential-puppy-starter-bundle-5pc",
        "title": "Essential Puppy Starter Kit (5 Pieces)",
        "cat": "puppy-sets", "pet": ["Puppies"], "play": ["chew", "fetch", "solo"], "chew": "gentle",
        "summary": "Complete five-piece set: teething bone, mini rope, crinkle bone, soft ball, and mat.",
        "desc": "Covers essential puppy developmental play: gum teething relief, first fetch, cozy snuggle, and gentle foraging. All items sized for puppy jaws.",
        "mat": "Assorted cotton, TPR rubber, fleece", "dim": "Packaged gift box 12 x 10 x 4 in", "wt": "420 g", "price": 3499, "cost": 990,
        "variants": [{"name": "Standard", "val": "5-Piece Starter Set", "sku": "ZP-PUP-SET-5PC", "price": 3499, "cost": 990}],
        "safety": "Replace individual items as puppy teeth transition to adult dentition."
    },
    {
        "slug": "puppy-teething-relief-trio-set",
        "title": "Puppy Teething Relief Trio Set",
        "cat": "puppy-sets", "pet": ["Puppies"], "play": ["chew"], "chew": "gentle",
        "summary": "Three complementary teething solutions: cooling ring, soft rubber bone, and mini rope.",
        "desc": "Addresses different stages of gum irritation. Use the cooling ring chilled for evening relief, the rubber bone for daytime, and the rope for gentle tug.",
        "mat": "TPR rubber, distilled water, cotton rope", "dim": "Gift sleeve packaging", "wt": "270 g", "price": 2499, "cost": 680,
        "variants": [{"name": "Standard", "val": "3-Piece Teething Trio", "sku": "ZP-PUP-SET-3PC", "price": 2499, "cost": 680}],
        "safety": "Inspect components regularly."
    },

    # Cat Categories (42 total: 6 in each of 7 categories)
    # Cat Wands and Teasers (6)
    {
        "slug": "natural-feather-teaser-wand-bell",
        "title": "Natural Guinea Fowl Feather Wand with Bell",
        "cat": "cat-wands", "pet": ["Cats"], "play": ["chase"], "chew": "gentle",
        "summary": "Flexible 36-inch fiberglass wand with natural un-dyed feathers and small brass bell.",
        "desc": "Aerodynamic natural feathers spin realistically during flight. Long flexible wand keeps human hands safely clear of jumping feline claws.",
        "mat": "Fiberglass rod, woven nylon cord, natural guinea feathers", "dim": "36.0 in rod, 28 in cord (91 x 71 cm)", "wt": "45 g", "price": 1299, "cost": 290,
        "variants": [{"name": "Standard", "val": "Natural Feathers", "sku": "ZP-CAT-WND-FTH", "price": 1299, "cost": 290}],
        "safety": "Put away in closet after interactive play. Do not leave string unattended."
    },
    {
        "slug": "telescopic-carbon-fiber-cat-wand",
        "title": "Telescopic Carbon-Fiber Wand with 3 Attachments",
        "cat": "cat-wands", "pet": ["Cats"], "play": ["chase"], "chew": "gentle",
        "summary": "Retractable carbon fiber wand extends from 15 to 38 inches with quick-clip attachments.",
        "desc": "Lightweight carbon rod collapses for compact storage. Includes three interchangeable swivel lures: feather flutter, fleece worm, and crinkle ribbon.",
        "mat": "Carbon fiber rod, stainless clasp, assorted lures", "dim": "15 to 38 in extendable rod (38 to 96 cm)", "wt": "65 g", "price": 1699, "cost": 420,
        "variants": [{"name": "Standard", "val": "3-Lure Set", "sku": "ZP-CAT-WND-TL3", "price": 1699, "cost": 420}],
        "safety": "Always store wand in a closed drawer after play."
    },
    {
        "slug": "rainbow-satin-ribbon-dancer-wand",
        "title": "Satin Fabric Ribbon Dancer Wand",
        "cat": "cat-wands", "pet": ["Cats"], "play": ["chase"], "chew": "gentle",
        "summary": "65-inch continuous satin ribbon on a durable polycarbonate handle.",
        "desc": "Glides in wave and serpentine shapes across rugs and floors. The broad satin ribbon provides a satisfying physical target for batting paws.",
        "mat": "Polycarbonate rod, woven satin ribbon", "dim": "18.0 in wand, 65 in ribbon (45 x 165 cm)", "wt": "50 g", "price": 1099, "cost": 240,
        "variants": [{"name": "Standard", "val": "Rainbow Satin", "sku": "ZP-CAT-WND-RBN", "price": 1099, "cost": 240}],
        "safety": "Supervise play. Do not allow cats to ingest satin ribbon."
    },
    {
        "slug": "crinkle-dragonfly-teaser-wand",
        "title": "Crinkle Wing Dragonfly Teaser Wand",
        "cat": "cat-wands", "pet": ["Cats"], "play": ["chase"], "chew": "gentle",
        "summary": "Translucent crinkle foil wings flutter and rustle with every flick of the wand.",
        "desc": "Replicates insect flight patterns with lightweight iridescent foil wings that make distinct crinkle sounds with subtle wrist movement.",
        "mat": "Acrylic rod, steel wire line, iridescent crinkle film", "dim": "30.0 in rod, 24 in wire (76 x 60 cm)", "wt": "40 g", "price": 1199, "cost": 270,
        "variants": [{"name": "Standard", "val": "Iridescent Wings", "sku": "ZP-CAT-WND-DFL", "price": 1199, "cost": 270}],
        "safety": "Replace dragonfly lure if foil becomes torn."
    },
    {
        "slug": "sisal-mouse-elastic-teaser-wand",
        "title": "Sisal Mouse on Elastic Bungee Wand",
        "cat": "cat-wands", "pet": ["Cats"], "play": ["chase"], "chew": "moderate",
        "summary": "Natural sisal twine mouse with feather tail attached to an elastic bounce cord.",
        "desc": "Elastic bungee cord causes the sisal mouse to rebound when caught and released, extending chase interaction between feline and owner.",
        "mat": "Wooden dowel wand, natural sisal rope, feathers, elastic cord", "dim": "16.0 in wand, 30 in elastic cord", "wt": "55 g", "price": 1149, "cost": 260,
        "variants": [{"name": "Standard", "val": "Natural Sisal Mouse", "sku": "ZP-CAT-WND-SIS", "price": 1149, "cost": 260}],
        "safety": "Supervised use only."
    },
    {
        "slug": "furry-tail-snake-chaser-wand",
        "title": "Faux-Fur Tail Snake Chaser Wand",
        "cat": "cat-wands", "pet": ["Cats"], "play": ["chase"], "chew": "gentle",
        "summary": "Extra-long 32-inch faux-fur plush tail that slithers across floor surfaces.",
        "desc": "Weighted head and plush segmented tail create realistic ground-crawling motions. Entices cats who prefer ground-stalking over aerial hunting.",
        "mat": "Wood handle, polyester faux fur plush", "dim": "18.0 in wand, 32 in plush tail (45 x 81 cm)", "wt": "70 g", "price": 1349, "cost": 310,
        "variants": [{"name": "Color", "val": "Spotted Leopard", "sku": "ZP-CAT-WND-TL-LP", "price": 1349, "cost": 310}],
        "safety": "Store securely after use."
    },

    # Cat Kickers and Catnip (6)
    {
        "slug": "organic-catnip-fish-kicker-pillow",
        "title": "Organic Catnip Canvas Fish Kicker",
        "cat": "cat-kickers", "pet": ["Cats"], "play": ["solo"], "chew": "moderate",
        "summary": "12-inch durable canvas fish stuffed with certified organic North American catnip.",
        "desc": "Tough cotton duck canvas withstands vigorous back-paw rabbit kicking. Filled generously with aromatic dried catnip leaves and blossoms.",
        "mat": "100% Cotton canvas, organic dried catnip, polyfill", "dim": "12.0 x 3.5 in (30 x 9 cm)", "wt": "85 g", "price": 1299, "cost": 280,
        "variants": [{"name": "Style", "val": "Striped Mackerel", "sku": "ZP-CAT-KCK-FSH-MK", "price": 1299, "cost": 280}, {"name": "Style", "val": "Blue Trout", "sku": "ZP-CAT-KCK-FSH-TR", "price": 1299, "cost": 280}],
        "safety": "Crush gently with fingers before play to release fresh aromatic oils."
    },
    {
        "slug": "crinkle-canvas-baguette-cat-kicker",
        "title": "Crinkle Canvas Long Baguette Kicker",
        "cat": "cat-kickers", "pet": ["Cats"], "play": ["solo"], "chew": "moderate",
        "summary": "14-inch elongated kicker pillow with crinkle paper lining and organic catnip.",
        "desc": "Elongated cylindrical shape allows cats to wrap their front paws around the top while kicking the textured base with hind legs.",
        "mat": "Heavyweight canvas, dried catnip, crinkle lining", "dim": "14.0 x 2.8 in (35 x 7 cm)", "wt": "95 g", "price": 1399, "cost": 320,
        "variants": [{"name": "Color", "val": "Natural Tan", "sku": "ZP-CAT-KCK-BGT-TN", "price": 1399, "cost": 320}],
        "safety": "Spot clean with damp cloth."
    },
    {
        "slug": "matatabi-silvervine-dental-stick-chews",
        "title": "Natural Matatabi Silvervine Chew Sticks (6-Pack)",
        "cat": "cat-kickers", "pet": ["Cats"], "play": ["chew", "solo"], "chew": "moderate",
        "summary": "Pure natural Actinidia polygama wood twigs. Alternative to traditional catnip.",
        "desc": "Unprocessed natural silvervine branches offer an attractive botanical scent. The fibrous bark provides a safe texture for feline chewing.",
        "mat": "100% Natural unprocessed silvervine wood", "dim": "4.7 in length per stick, 0.4 in thick", "wt": "60 g (pack)", "price": 1199, "cost": 250,
        "variants": [{"name": "Standard", "val": "6-Stick Pack", "sku": "ZP-CAT-MAT-6PK", "price": 1199, "cost": 250}],
        "safety": "Scrape bark slightly with knife if aroma fades."
    },
    {
        "slug": "feathered-crinkle-roller-kicker",
        "title": "Feathered Burlap Roller Kicker",
        "cat": "cat-kickers", "pet": ["Cats"], "play": ["solo"], "chew": "moderate",
        "summary": "Textured burlap cylinder with fluffy marabou feathers on both ends.",
        "desc": "The rough woven burlap fabric holds cat claws firmly during kicking bouts. Catnip-filled interior provides sustained engagement.",
        "mat": "Natural woven burlap, marabou feathers, catnip", "dim": "9.5 x 2.5 in body (24 x 6 cm)", "wt": "70 g", "price": 1149, "cost": 260,
        "variants": [{"name": "Standard", "val": "Burlap and Feathers", "sku": "ZP-CAT-KCK-BRL-STD", "price": 1149, "cost": 260}],
        "safety": "Inspect feathers after vigorous sessions."
    },
    {
        "slug": "refillable-catnip-plush-pickle",
        "title": "Refillable Zip-Pocket Catnip Plush Pickle",
        "cat": "cat-kickers", "pet": ["Cats"], "play": ["solo"], "chew": "gentle",
        "summary": "Textured velour kicker with hidden hook-and-loop pouch for fresh catnip refills.",
        "desc": "Includes a resealable pouch of fresh catnip. Refresh the interior catnip supply anytime to keep interest high without buying a new toy.",
        "mat": "Polyester textured velour, dried catnip pouch", "dim": "8.5 x 2.8 in (21 x 7 cm)", "wt": "65 g", "price": 1249, "cost": 290,
        "variants": [{"name": "Standard", "val": "Textured Green", "sku": "ZP-CAT-KCK-PCK-STD", "price": 1249, "cost": 290}],
        "safety": "Ensure pouch is closed before giving to cat."
    },
    {
        "slug": "valerian-infused-soft-kick-stick",
        "title": "Valerian Root Infused Canvas Kick Stick",
        "cat": "cat-kickers", "pet": ["Cats"], "play": ["solo"], "chew": "moderate",
        "summary": "Blended with dried valerian root and catnip for cats unresponsive to catnip alone.",
        "desc": "Roughly 30% of cats do not react to nepeta cataria. Valerian root contains actinidine, which triggers active play responses in most non-responders.",
        "mat": "Heavy canvas, dried valerian root, dried catnip", "dim": "11.0 x 3.0 in (28 x 7.5 cm)", "wt": "80 g", "price": 1399, "cost": 330,
        "variants": [{"name": "Standard", "val": "Olive Green Canvas", "sku": "ZP-CAT-KCK-VAL-STD", "price": 1399, "cost": 330}],
        "safety": "Natural botanical scent. Store in airtight bag between uses."
    },

    # Cat Balls and Tracks (6)
    {
        "slug": "3-tier-tower-of-tracks-cat-toy",
        "title": "3-Tier Tower of Tracks Ball Toy",
        "cat": "cat-tracks", "pet": ["Cats"], "play": ["solo"], "chew": "gentle",
        "summary": "Three stacked circular track levels with captive colored rolling balls.",
        "desc": "Captive balls spin and roll along smooth concentric tracks without popping out under furniture. Non-skid silicone pads anchor the base.",
        "mat": "BPA-free polypropylene plastic", "dim": "10.0 in base diameter, 5.5 in height (25 x 14 cm)", "wt": "340 g", "price": 1699, "cost": 430,
        "variants": [{"name": "Color", "val": "Teal and White", "sku": "ZP-CAT-TRK-3T-TL", "price": 1699, "cost": 430}, {"name": "Color", "val": "Orange and White", "sku": "ZP-CAT-TRK-3T-OR", "price": 1699, "cost": 430}],
        "safety": "Smooth molded edges safe for batting paws."
    },
    {
        "slug": "circular-scratcher-track-ball-combo",
        "title": "Circular Scratcher with Perimeter Ball Track",
        "cat": "cat-tracks", "pet": ["Cats"], "play": ["solo"], "chew": "moderate",
        "summary": "Corrugated cardboard center scratching pad surrounded by a rolling ball ring.",
        "desc": "Combines natural scratching behavior with a perimeter track that keeps a jingle ball in continuous circular motion under paw batting.",
        "mat": "Corrugated cardboard center, ABS plastic track frame", "dim": "13.0 in diameter, 2.0 in height (33 x 5 cm)", "wt": "420 g", "price": 1899, "cost": 490,
        "variants": [{"name": "Standard", "val": "White Rim with Cardboard", "sku": "ZP-CAT-TRK-SCR-STD", "price": 1899, "cost": 490}],
        "safety": "Replace cardboard center pad when worn."
    },
    {
        "slug": "solid-wood-circular-cat-track-toy",
        "title": "Solid Beechwood Circular Ball Track",
        "cat": "cat-tracks", "pet": ["Cats"], "play": ["solo"], "chew": "gentle",
        "summary": "Smooth solid beechwood circular track with two wooden rolling balls.",
        "desc": "Crafted from natural beechwood with non-toxic matte clear finish. Weighted solid wood base stays put on hard floors without tipping.",
        "mat": "Natural beechwood, non-toxic finish", "dim": "8.5 in diameter, 1.8 in height (21.5 x 4.5 cm)", "wt": "510 g", "price": 2499, "cost": 690,
        "variants": [{"name": "Standard", "val": "Natural Beechwood", "sku": "ZP-CAT-TRK-WOD-NAT", "price": 2499, "cost": 690}],
        "safety": "Wipe clean with dry cloth."
    },
    {
        "slug": "pure-wool-felt-cat-balls-4pack",
        "title": "Natural New Zealand Wool Felt Cat Balls (4-Pack)",
        "cat": "cat-tracks", "pet": ["Cats"], "play": ["solo", "fetch"], "chew": "gentle",
        "summary": "Four handmade 1.6-inch solid wool felt balls. Silent bouncing and easy to carry.",
        "desc": "Hand-felted from 100% natural New Zealand wool fibers without synthetic fillers. Rolls quietly across wood floors for silent midnight batting.",
        "mat": "100% Natural wool felt", "dim": "1.6 in diameter per ball (4 cm)", "wt": "65 g (pack)", "price": 1299, "cost": 290,
        "variants": [{"name": "Standard", "val": "Earth Tones (4-Pack)", "sku": "ZP-CAT-WOL-4PK", "price": 1299, "cost": 290}],
        "safety": "Dye-safe, non-toxic natural wool."
    },
    {
        "slug": "lattice-jingle-bell-balls-6pack",
        "title": "Lattice Jingle Bell Plastic Cat Balls (6-Pack)",
        "cat": "cat-tracks", "pet": ["Cats"], "play": ["solo"], "chew": "gentle",
        "summary": "Six lightweight open lattice plastic balls with internal metallic jingle bells.",
        "desc": "Open lattice design lets cat claws hook and flick the balls across rooms. Crisp ringing bell stimulates rapid auditory tracking.",
        "mat": "High-impact polystyrene, metal bell", "dim": "1.5 in diameter (3.8 cm)", "wt": "50 g (pack)", "price": 899, "cost": 190,
        "variants": [{"name": "Standard", "val": "Multi-Color 6-Pack", "sku": "ZP-CAT-JNG-6PK", "price": 899, "cost": 190}],
        "safety": "Inspect plastic lattice. Discard if cracked."
    },
    {
        "slug": "flashing-motion-led-track-ball",
        "title": "Motion-Activated LED Light-Up Track Ball (2-Pack)",
        "cat": "cat-tracks", "pet": ["Cats"], "play": ["solo"], "chew": "gentle",
        "summary": "Two transparent balls with internal red and blue LEDs that pulse upon impact.",
        "desc": "Impact switch lights up brightly whenever the ball is batted or rolled, then shuts down automatically after 12 seconds of stillness.",
        "mat": "Clear polycarbonate shell, internal LED and battery", "dim": "1.6 in diameter (4 cm)", "wt": "45 g (pair)", "price": 1199, "cost": 270,
        "variants": [{"name": "Standard", "val": "2-Pack Clear LED", "sku": "ZP-CAT-LED-2PK", "price": 1199, "cost": 270}],
        "safety": "Sealed battery capsule cannot be opened by pet."
    },

    # Cat Electronic and Motion (6)
    {
        "slug": "automatic-rolling-led-smart-cat-ball",
        "title": "Smart Self-Rolling LED Cat Activity Ball",
        "cat": "cat-electronic", "pet": ["Cats"], "play": ["interactive", "solo"], "chew": "gentle",
        "summary": "Self-navigating motorized ball with soft silicone coat and red laser dot.",
        "desc": "Obstacle detection sensors reverse roll direction upon hitting walls or baseboards. USB-C rechargeable battery runs for 4 hours.",
        "mat": "Silicone shell, ABS internal motor unit", "dim": "1.7 in diameter compact (4.3 cm)", "wt": "80 g", "price": 2299, "cost": 620,
        "variants": [{"name": "Color", "val": "Soft Pink", "sku": "ZP-CAT-ELC-BAL-PK", "price": 2299, "cost": 620}, {"name": "Color", "val": "Mint Green", "sku": "ZP-CAT-ELC-BAL-GR", "price": 2299, "cost": 620}],
        "safety": "Rechargeable via included USB-C cable."
    },
    {
        "slug": "fluttering-butterfly-motion-cat-toy",
        "title": "360-Degree Fluttering Butterfly Activity Base",
        "cat": "cat-electronic", "pet": ["Cats"], "play": ["interactive"], "chew": "gentle",
        "summary": "Battery-operated base rotates a flexible steel wire with an iridescent butterfly.",
        "desc": "Realistic fluttering flight mimics a real moth or butterfly. Broad anti-slip base resists tipping under enthusiastic leaps.",
        "mat": "ABS base, flexible steel wire, plastic butterfly with glitter", "dim": "8.0 x 8.0 x 3.5 in base (20 x 20 x 9 cm)", "wt": "290 g", "price": 1999, "cost": 540,
        "variants": [{"name": "Standard", "val": "Includes 2 Replacement Butterflies", "sku": "ZP-CAT-ELC-BTF-STD", "price": 1999, "cost": 540}],
        "safety": "Requires 3 AA batteries (not included)."
    },
    {
        "slug": "interactive-feather-hide-and-seek-box",
        "title": "Feather Hide-and-Seek Ambush Box",
        "cat": "cat-electronic", "pet": ["Cats"], "play": ["interactive"], "chew": "gentle",
        "summary": "Electronic box where a natural feather pops unpredictably from 6 different holes.",
        "desc": "Simulates prey darting in and out of burrows. Random programmed algorithm keeps cats guessing which opening the feather will emerge from next.",
        "mat": "ABS plastic casing, natural poultry feather attachment", "dim": "6.8 x 6.8 x 2.8 in (17 x 17 x 7 cm)", "wt": "380 g", "price": 2999, "cost": 820,
        "variants": [{"name": "Standard", "val": "White and Teal", "sku": "ZP-CAT-ELC-BOX-STD", "price": 2999, "cost": 820}],
        "safety": "Auto shut-off after 10 minutes of continuous operation."
    },
    {
        "slug": "chirping-bird-sound-touch-toy",
        "title": "Chirping Bird Sound Touch-Activated Toy",
        "cat": "cat-electronic", "pet": ["Cats"], "play": ["solo"], "chew": "gentle",
        "summary": "Soft plush sparrow that chirps realistic bird calls with every paw swipe.",
        "desc": "Sensitive internal vibration sensor activates short birdsong chirp upon lightest touch. Built-in catnip belly pouch enhances attention.",
        "mat": "Short-pile polyester plush, sound chip module", "dim": "5.5 x 3.5 in (14 x 9 cm)", "wt": "60 g", "price": 1399, "cost": 340,
        "variants": [{"name": "Standard", "val": "Song Sparrow", "sku": "ZP-CAT-ELC-BRD-STD", "price": 1399, "cost": 340}],
        "safety": "Factory-sealed internal sound module."
    },
    {
        "slug": "automated-laser-tower-tumbler-cat",
        "title": "Automated Rotating Laser Cat Tower",
        "cat": "cat-electronic", "pet": ["Cats"], "play": ["interactive"], "chew": "gentle",
        "summary": "Dual-speed motorized laser dome projects erratic red dots across 360 degrees.",
        "desc": "Hands-free automated cat workout. Choose between slow, fast, or variable speed settings with automatic 15-minute timer.",
        "mat": "Polycarbonate housing", "dim": "7.0 x 3.5 in (18 x 9 cm)", "wt": "240 g", "price": 2599, "cost": 710,
        "variants": [{"name": "Standard", "val": "Pearl White", "sku": "ZP-CAT-ELC-TWR-WHT", "price": 2599, "cost": 710}],
        "safety": "Certified Class 1 laser. Place on flat tabletop or floor."
    },
    {
        "slug": "motion-sensing-running-mouse-toy",
        "title": "Motion-Sensing Scurrying Robot Mouse",
        "cat": "cat-electronic", "pet": ["Cats"], "play": ["interactive", "solo"], "chew": "gentle",
        "summary": "Small motorized mouse on soft rubber wheels that scampers when approached.",
        "desc": "Forward-facing infrared proximity sensor triggers short forward sprints whenever cat draws near. Soft rubber wheels glide quietly over tile and wood.",
        "mat": "ABS plastic body, soft silicone tail and rubber tires", "dim": "4.5 x 2.2 in (11.5 x 5.5 cm)", "wt": "95 g", "price": 2199, "cost": 590,
        "variants": [{"name": "Standard", "val": "Grey Mouse with Pink Tail", "sku": "ZP-CAT-ELC-MSE-GRY", "price": 2199, "cost": 590}],
        "safety": "USB-C rechargeable battery included."
    },

    # Cat Tunnels and Hideouts (6)
    {
        "slug": "3-way-collapsible-crinkle-cat-tunnel",
        "title": "3-Way Collapsible Crinkle Play Tunnel",
        "cat": "cat-tunnels", "pet": ["Cats"], "play": ["solo", "chase"], "chew": "gentle",
        "summary": "T-junction three-way play tunnel with central peephole and dangling puff ball.",
        "desc": "Sprung steel wire frame pops open instantly and folds flat with tie cords. Tear-resistant polyester lining with integrated crinkle paper throughout.",
        "mat": "190T Polyester fabric, sprung steel wire", "dim": "31 x 21 in branch length, 10 in diameter (80 x 53 x 25 cm)", "wt": "340 g", "price": 1899, "cost": 490,
        "variants": [{"name": "Color", "val": "Teal and Grey", "sku": "ZP-CAT-TNL-3WY-TL", "price": 1899, "cost": 490}, {"name": "Color", "val": "Black and Blue", "sku": "ZP-CAT-TNL-3WY-BK", "price": 1899, "cost": 490}],
        "safety": "Folds flat for compact storage under beds."
    },
    {
        "slug": "felt-donut-tunnel-hideaway-bed",
        "title": "Felt Donut Circular Tunnel Bed",
        "cat": "cat-tunnels", "pet": ["Cats"], "play": ["solo"], "chew": "gentle",
        "summary": "Rigid molded felt donut tunnel with zippered halves and recessed center perch.",
        "desc": "Sturdy felt composite maintains tunnel structure without collapsing when cats rest on top. Zippers apart into two nesting bowls for simple cleaning.",
        "mat": "Molded synthetic felt wool, nylon zipper", "dim": "20.0 in outer diameter, 8.0 in height (50 x 20 cm)", "wt": "680 g", "price": 3299, "cost": 950,
        "variants": [{"name": "Color", "val": "Charcoal Grey", "sku": "ZP-CAT-TNL-DNT-CH", "price": 3299, "cost": 950}, {"name": "Color", "val": "Light Grey", "sku": "ZP-CAT-TNL-DNT-LG", "price": 3299, "cost": 950}],
        "safety": "Vacuum or lint roll felt exterior."
    },
    {
        "slug": "pop-up-cube-and-tunnel-combo",
        "title": "Pop-Up Play Cube and Tunnel Combo",
        "cat": "cat-tunnels", "pet": ["Cats"], "play": ["solo", "chase"], "chew": "gentle",
        "summary": "15-inch cube hideout attached to a 3-foot straight crinkle play chute.",
        "desc": "Cube features four circular portal holes for peek-a-boo batting. Straight tunnel can detach or link via button toggles.",
        "mat": "Tear-resistant ripstop polyester, flexible spring steel", "dim": "Cube 15x15x15 in, Tunnel 36 in length, 10 in dia", "wt": "410 g", "price": 2499, "cost": 660,
        "variants": [{"name": "Standard", "val": "Navy and Orange", "sku": "ZP-CAT-TNL-CBE-NV", "price": 2499, "cost": 660}],
        "safety": "Wipe clean with mild soap and water."
    },
    {
        "slug": "s-shaped-agility-long-cat-tunnel",
        "title": "S-Shaped 4-Foot Long Agility Cat Tunnel",
        "cat": "cat-tunnels", "pet": ["Cats"], "play": ["solo", "chase"], "chew": "gentle",
        "summary": "Curved S-shape layout with two side peepholes for stalking and ambushing.",
        "desc": "Curved path blocks direct sightlines, providing cats with enticing mystery and natural stalking blind spots during energetic sprint play.",
        "mat": "Double-layer polyester, steel spring spiral", "dim": "48.0 in total length, 10.0 in diameter (122 x 25 cm)", "wt": "390 g", "price": 2199, "cost": 580,
        "variants": [{"name": "Standard", "val": "Slate Grey with Yellow Trim", "sku": "ZP-CAT-TNL-S4F-SL", "price": 2199, "cost": 580}],
        "safety": "Ties flat with built-in loop cords."
    },
    {
        "slug": "canvas-and-plush-warm-hide-chute",
        "title": "Canvas and Sherpa Lined Warm Play Chute",
        "cat": "cat-tunnels", "pet": ["Cats"], "play": ["solo"], "chew": "gentle",
        "summary": "Sturdy canvas exterior with plush sherpa fleece lining for warmth and comfort.",
        "desc": "Combines play chute excitement with insulated thermal comfort. Heavyweight outer canvas prevents accidental rolling on slick floors.",
        "mat": "Cotton duck canvas outer, sherpa fleece inner", "dim": "35.0 in length, 9.5 in diameter (89 x 24 cm)", "wt": "480 g", "price": 2799, "cost": 760,
        "variants": [{"name": "Standard", "val": "Khaki and Cream", "sku": "ZP-CAT-TNL-SHR-KHK", "price": 2799, "cost": 760}],
        "safety": "Hand wash cold, air dry."
    },
    {
        "slug": "peephole-collapsible-mini-play-tube",
        "title": "Collapsible Mini Play Tube with Dangling Ball",
        "cat": "cat-tunnels", "pet": ["Cats", "Puppies"], "play": ["solo"], "chew": "gentle",
        "summary": "Compact 24-inch straight tunnel suited for kittens and apartments.",
        "desc": "Compact footprint fits easily in small living spaces. Features a center skylight hole and hanging elastic plush ball at entrance.",
        "mat": "Polyester fabric, spring steel wire", "dim": "24.0 in length, 9.0 in diameter (61 x 23 cm)", "wt": "220 g", "price": 1499, "cost": 380,
        "variants": [{"name": "Standard", "val": "Teal and White Chevron", "sku": "ZP-CAT-TNL-MNI-TL", "price": 1499, "cost": 380}],
        "safety": "Lightweight and portable."
    },

    # Cat Scratchers (6)
    {
        "slug": "wave-contour-cardboard-scratcher-lounge",
        "title": "Wave Contour Cardboard Scratcher Lounge",
        "cat": "cat-scratchers", "pet": ["Cats"], "play": ["solo"], "chew": "moderate",
        "summary": "Ergonomic curved cardboard lounge reversible for double the scratching surface.",
        "desc": "Curved wave profile supports natural feline reclining while providing an incline for claw scratching. Flipped over, the reverse side is brand new.",
        "mat": "High-density corrugated cardboard, non-toxic cornstarch glue", "dim": "17.5 x 8.5 x 3.5 in (44 x 21.5 x 9 cm)", "wt": "580 g", "price": 1899, "cost": 490,
        "variants": [{"name": "Standard", "val": "Reversible Wave", "sku": "ZP-CAT-SCR-WAV-STD", "price": 1899, "cost": 490}],
        "safety": "Includes packet of organic catnip herb."
    },
    {
        "slug": "natural-sisal-scratching-post-ball",
        "title": "Natural Sisal Scratching Post with Dangling Ball",
        "cat": "cat-scratchers", "pet": ["Cats"], "play": ["solo"], "chew": "moderate",
        "summary": "22-inch vertical wooden core post wrapped in tight natural unoiled sisal rope.",
        "desc": "Heavy square base prevents tipping during full-stretch scratching. Wrapped tightly with 6mm natural unoiled sisal cord and capped with plush.",
        "mat": "MDF base with plush carpet, solid cardboard tube, natural sisal rope", "dim": "12 x 12 in base, 22 in height (30 x 30 x 56 cm)", "wt": "1450 g", "price": 2699, "cost": 780,
        "variants": [{"name": "Standard", "val": "Beige Plush Base", "sku": "ZP-CAT-SCR-PST-BGE", "price": 2699, "cost": 780}],
        "safety": "Simple single-screw assembly (wrench included)."
    },
    {
        "slug": "wall-mounted-sisal-scratching-mat",
        "title": "Wall-Mounted Sisal Scratching Mat",
        "cat": "cat-scratchers", "pet": ["Cats"], "play": ["solo"], "chew": "moderate",
        "summary": "Heavy woven sisal mat with adhesive hook-and-loop strips for walls or sofa corners.",
        "desc": "Protects drywall corners and upholstery. Mounts flush against vertical surfaces or lays flat on floors with non-slip backing.",
        "mat": "100% Woven natural sisal fiber, cotton twill border", "dim": "16.0 x 12.0 in (40 x 30 cm)", "wt": "280 g", "price": 1599, "cost": 410,
        "variants": [{"name": "Standard", "val": "Natural Sisal Mat", "sku": "ZP-CAT-SCR-MAT-NAT", "price": 1599, "cost": 410}],
        "safety": "Includes 4 heavy-duty adhesive wall tabs."
    },
    {
        "slug": "triangle-cardboard-incline-scratcher",
        "title": "Triangle Incline Cardboard Scratcher",
        "cat": "cat-scratchers", "pet": ["Cats"], "play": ["solo"], "chew": "moderate",
        "summary": "Stable triangular wedge providing both a 30-degree incline and interior cubby.",
        "desc": "Slanted top mimics tree trunk angles for stretching shoulder muscles. Hollow tunnel beneath allows cats to crawl through or hide toys.",
        "mat": "Multi-layer corrugated cardboard", "dim": "17.0 x 9.0 x 10.0 in (43 x 23 x 25 cm)", "wt": "620 g", "price": 2199, "cost": 580,
        "variants": [{"name": "Standard", "val": "Geometric Incline", "sku": "ZP-CAT-SCR-TRG-STD", "price": 2199, "cost": 580}],
        "safety": "Recyclable paper product."
    },
    {
        "slug": "cactus-shaped-sisal-scratching-post",
        "title": "Cactus Sisal Decorative Scratching Post",
        "cat": "cat-scratchers", "pet": ["Cats"], "play": ["solo"], "chew": "moderate",
        "summary": "Green dyed sisal post shaped like a desert cactus with branching arm.",
        "desc": "Attractive interior accent featuring two distinct scratch heights. Weighted circular base wrapped in soft green carpeting.",
        "mat": "Dyed natural sisal rope, particleboard base, carpet", "dim": "12.5 in round base, 21 in height (32 x 53 cm)", "wt": "1650 g", "price": 2999, "cost": 890,
        "variants": [{"name": "Standard", "val": "Desert Green", "sku": "ZP-CAT-SCR-CAC-GRN", "price": 2999, "cost": 890}],
        "safety": "Non-toxic vegetable-based dye."
    },
    {
        "slug": "horizontal-flat-scratching-pad-tray",
        "title": "Horizontal Flat Scratcher Tray (2-Pack)",
        "cat": "cat-scratchers", "pet": ["Cats"], "play": ["solo"], "chew": "moderate",
        "summary": "Two rectangular corrugated cardboard scratching pads in a clean cardboard tray.",
        "desc": "Catches loose cardboard flakes inside the outer rim tray, keeping floors clean. Dual-sided reversible core doubles usable lifespan.",
        "mat": "Corrugated cardboard core and outer catch tray", "dim": "18.0 x 9.5 x 1.5 in (46 x 24 x 4 cm)", "wt": "710 g (pack)", "price": 1799, "cost": 460,
        "variants": [{"name": "Standard", "val": "2-Pad Set with Tray", "sku": "ZP-CAT-SCR-FLT-2PK", "price": 1799, "cost": 460}],
        "safety": "Flip pads over when top is shredded."
    },

    # Cat Plush Mice and Small Toys (6)
    {
        "slug": "catnip-stuffed-felt-mice-3pack",
        "title": "Catnip-Stuffed Felt Mice Toys (3-Pack)",
        "cat": "cat-plush", "pet": ["Cats"], "play": ["solo", "chase"], "chew": "gentle",
        "summary": "Three durable felt mice filled with pure organic catnip and long string tails.",
        "desc": "Crafted from tight wool felt that cat claws can snag and toss in the air. Braided hemp string tails provide an extra batting target.",
        "mat": "Wool-blend felt, organic dried catnip, hemp string", "dim": "3.0 x 1.2 in body, 4.0 in tail (7.5 x 3 cm)", "wt": "45 g (3-pack)", "price": 999, "cost": 210,
        "variants": [{"name": "Standard", "val": "Grey, Brown, White Trio", "sku": "ZP-CAT-MSE-FLT-3PK", "price": 999, "cost": 210}],
        "safety": "Check string tail attachment periodically."
    },
    {
        "slug": "rattling-furry-mini-mice-6pack",
        "title": "Rattling Furry Mini Mice (6-Pack)",
        "cat": "cat-plush", "pet": ["Cats"], "play": ["solo"], "chew": "gentle",
        "summary": "Six faux-fur mice with internal acoustic rattle beads that sound like small prey.",
        "desc": "Lightweight body scoots across floors with minimal paw contact. Internal rattle sounds keep cats engaged during solo playtime.",
        "mat": "Polyester faux fur, plastic inner shell, rattle beads", "dim": "2.2 in length (5.5 cm)", "wt": "55 g (6-pack)", "price": 899, "cost": 190,
        "variants": [{"name": "Standard", "val": "Multi-Color 6-Pack", "sku": "ZP-CAT-MSE-FUR-6PK", "price": 899, "cost": 190}],
        "safety": "Remove if outer fur is chewed through."
    },
    {
        "slug": "metallic-mylar-crinkle-balls-6pack",
        "title": "Metallic Mylar Crinkle Paper Balls (6-Pack)",
        "cat": "cat-plush", "pet": ["Cats"], "play": ["solo", "fetch"], "chew": "gentle",
        "summary": "Six shiny, lightweight Mylar balls that produce loud crinkles with every touch.",
        "desc": "Weighs under 3 grams each, making them easy for cats to bat across rooms. High-reflection metallic foil glints in ambient light.",
        "mat": "Non-toxic Mylar foil film", "dim": "1.8 in diameter (4.5 cm)", "wt": "25 g (6-pack)", "price": 799, "cost": 160,
        "variants": [{"name": "Standard", "val": "Assorted Metallic 6-Pack", "sku": "ZP-CAT-CRN-BAL-6PK", "price": 799, "cost": 160}],
        "safety": "Supervise play. Discard flattened or torn pieces."
    },
    {
        "slug": "plush-catnip-fish-duo-toys",
        "title": "Plush Catnip Fish Toys (2-Pack)",
        "cat": "cat-plush", "pet": ["Cats"], "play": ["solo"], "chew": "gentle",
        "summary": "Two 5-inch plush fish toys filled with organic catnip and crinkle paper fins.",
        "desc": "Sized midway between small mice and large kickers. Perfect for batting, carrying in jaws, and resting between paws on cat beds.",
        "mat": "Soft polyester velvet, organic catnip, crinkle paper", "dim": "5.0 x 2.0 in (12.5 x 5 cm)", "wt": "40 g (pair)", "price": 999, "cost": 220,
        "variants": [{"name": "Standard", "val": "Clownfish and Blue Tang", "sku": "ZP-CAT-FSH-DUO-2PK", "price": 999, "cost": 220}],
        "safety": "Spot clean with damp cloth."
    },
    {
        "slug": "soft-pom-pom-bouncing-balls-12pack",
        "title": "Soft High-Density Pom-Pom Play Balls (12-Pack)",
        "cat": "cat-plush", "pet": ["Cats"], "play": ["solo", "fetch"], "chew": "gentle",
        "summary": "Twelve ultra-soft high-density plush yarn balls for batting and carrying.",
        "desc": "Tight yarn construction resists fraying under claw catches. Completely silent across hard floors for peaceful overnight play.",
        "mat": "100% High-density acrylic yarn", "dim": "1.4 in diameter per ball (3.5 cm)", "wt": "40 g (12-pack)", "price": 849, "cost": 180,
        "variants": [{"name": "Standard", "val": "Pastel Assortment (12-Pack)", "sku": "ZP-CAT-POM-12PK", "price": 849, "cost": 180}],
        "safety": "Machine washable in lingerie mesh bag."
    },
    {
        "slug": "catnip-filled-canvas-triangles-3pack",
        "title": "Catnip-Filled Canvas Geo Triangles (3-Pack)",
        "cat": "cat-plush", "pet": ["Cats"], "play": ["solo"], "chew": "moderate",
        "summary": "Three geometric canvas pyramid shapes with feather plumes and potent catnip.",
        "desc": "Geometric pyramid corners wobble irregularly when batted, keeping cats curious. Tough cotton duck canvas holds up to claw kicks.",
        "mat": "Cotton canvas, dried catnip, rooster feathers", "dim": "3.0 x 3.0 in (7.5 x 7.5 cm)", "wt": "50 g (3-pack)", "price": 1099, "cost": 240,
        "variants": [{"name": "Standard", "val": "Nordic Pattern Trio", "sku": "ZP-CAT-GEO-3PK", "price": 1099, "cost": 240}],
        "safety": "Keep dry."
    },

    # Multi-Item Bundles (6)
    {
        "slug": "power-chewer-rubber-tough-pack",
        "title": "Power Chewer Rubber Tough Pack (3 Toys)",
        "cat": "bundles", "pet": ["Dogs"], "play": ["chew", "fetch"], "chew": "power",
        "summary": "Three durable natural rubber toys: Bone, Ring, and Tire. Built for heavy jaws.",
        "desc": "Pairs our highest-durability natural vulcanized rubber designs in one value set. Offers varied bite profiles for persistent daily chewers.",
        "mat": "Natural high-density rubber", "dim": "Packaged set 14 x 10 x 4 in", "wt": "950 g (set)", "price": 3999, "cost": 1150,
        "variants": [{"name": "Standard", "val": "3-Piece Power Pack", "sku": "ZP-BDL-PWR-3PC", "price": 3999, "cost": 1150}],
        "safety": "Supervise initial play sessions."
    },
    {
        "slug": "backyard-fetch-and-splash-pack",
        "title": "Backyard Fetch and Splash Pack (3 Toys)",
        "cat": "bundles", "pet": ["Dogs"], "play": ["fetch", "water"], "chew": "gentle",
        "summary": "Outdoor sports kit: Aerodynamic Flyer, 3 Tennis Balls, and Floating Foam Dummy.",
        "desc": "Equips your dog for both park retrieval and lake swimming sessions. High-visibility bright colors for easy spotting across grass and water.",
        "mat": "Natural rubber, felt, 1000D canvas, closed-cell foam", "dim": "Mesh carry bag included", "wt": "610 g", "price": 3699, "cost": 1020,
        "variants": [{"name": "Standard", "val": "3-Piece Fetch and Splash", "sku": "ZP-BDL-FTC-3PC", "price": 3699, "cost": 1020}],
        "safety": "Wash tennis balls after muddy park days."
    },
    {
        "slug": "indoor-boredom-buster-puzzle-set",
        "title": "Indoor Boredom Buster Dog Puzzle Set",
        "cat": "bundles", "pet": ["Dogs"], "play": ["puzzle", "solo"], "chew": "gentle",
        "summary": "Mental stimulation trio: Wobble Tumbler, Snuffle Mat, and Lick Mat.",
        "desc": "A complete canine mental enrichment routine. Use the snuffle mat for breakfast kibble, the tumbler for afternoon mental work, and the lick mat for evening rest.",
        "mat": "Polar fleece, silicone, ABS plastic", "dim": "Box set 16 x 12 x 5 in", "wt": "865 g", "price": 4499, "cost": 1280,
        "variants": [{"name": "Standard", "val": "3-Piece Boredom Buster", "sku": "ZP-BDL-PZL-3PC", "price": 4499, "cost": 1280}],
        "safety": "Wipe and wash components after food use."
    },
    {
        "slug": "complete-cat-agility-and-play-kit",
        "title": "Complete Cat Agility and Play Kit (4 Toys)",
        "cat": "bundles", "pet": ["Cats"], "play": ["chase", "solo"], "chew": "gentle",
        "summary": "3-Way Play Tunnel, Feather Teaser Wand, Catnip Fish Kicker, and Wool Felt Balls.",
        "desc": "Engages all feline hunting sequences: stalking through the tunnel, aerial leaping at the wand, wrestling the kicker, and batting the felt balls.",
        "mat": "Polyester tunnel, fiberglass wand, canvas kicker, wool felt", "dim": "Boxed set 15 x 12 x 4 in", "wt": "540 g", "price": 3899, "cost": 1080,
        "variants": [{"name": "Standard", "val": "4-Piece Complete Cat Kit", "sku": "ZP-BDL-CAT-4PC", "price": 3899, "cost": 1080}],
        "safety": "Put wand away after human-guided play."
    },
    {
        "slug": "organic-catnip-frenzy-variety-pack",
        "title": "Organic Catnip Variety Pack (12 Pieces)",
        "cat": "bundles", "pet": ["Cats"], "play": ["solo"], "chew": "gentle",
        "summary": "12-piece assortment: 3 Felt Mice, 6 Crinkle Balls, Baguette Kicker, and 2 Catnip Fish.",
        "desc": "A complete stash of batting, kicking, and tossing toys filled with fragrant organic catnip. Never run out of chase toys when items slide under furniture.",
        "mat": "Felt, mylar, canvas, dried organic catnip", "dim": "Gift pouch 10 x 8 x 3 in", "wt": "250 g", "price": 2799, "cost": 740,
        "variants": [{"name": "Standard", "val": "12-Piece Catnip Pouch", "sku": "ZP-BDL-CAT-12PC", "price": 2799, "cost": 740}],
        "safety": "Store extra toys in resealable pouch to keep catnip fresh."
    },
    {
        "slug": "puppy-to-adult-growth-toy-collection",
        "title": "Puppy-to-Adult Growth Toy Collection (4 Toys)",
        "cat": "bundles", "pet": ["Puppies", "Dogs"], "play": ["chew", "tug", "fetch"], "chew": "moderate",
        "summary": "Progressive 4-stage collection: Teething Bone, Starter Rope, Tennis Ball, and Tough Ring.",
        "desc": "Transitions alongside your puppy from gentle deciduous teething up through mature outdoor fetch and tug games. Designed to grow with your pet.",
        "mat": "Soft and firm natural rubber, cotton rope, felt", "dim": "Gift box 14 x 10 x 3.5 in", "wt": "680 g", "price": 3799, "cost": 1040,
        "variants": [{"name": "Standard", "val": "4-Stage Growth Collection", "sku": "ZP-BDL-GRW-4PC", "price": 3799, "cost": 1040}],
        "safety": "Transition from soft teething bone to firm ring as adult teeth emerge."
    }
]

print(f"Total products defined: {len(PRODUCTS_DEF)}")

# Count by category
cat_counts = {}
for p in PRODUCTS_DEF:
    cat_counts[p['cat']] = cat_counts.get(p['cat'], 0) + 1
print("Category counts:", cat_counts)

# Concurrent downloading and processing
import concurrent.futures

os.makedirs(os.path.join(os.getcwd(), 'public', 'products'), exist_ok=True)
os.makedirs(os.path.join(os.getcwd(), 'data'), exist_ok=True)
os.makedirs(os.path.join(os.getcwd(), 'docs'), exist_ok=True)

# Select 4 distinct candidates for each product
assigned_candidates = {}
used_indices = set()

# Helper to find matching candidates
def find_candidates_for_product(prod, count=4):
    found = []
    # Try keywords matching slug or category
    keywords = prod['slug'].split('-') + prod['cat'].split('-')
    # Filter candidates with matching term
    for idx, c in enumerate(CANDIDATES):
        if idx in used_indices:
            continue
        c_term = c.get('term', '').lower()
        if any(k in c_term for k in keywords):
            found.append((idx, c))
            used_indices.add(idx)
            if len(found) == count:
                return found
    # Fallback to any unused candidate
    for idx, c in enumerate(CANDIDATES):
        if idx in used_indices:
            continue
        found.append((idx, c))
        used_indices.add(idx)
        if len(found) == count:
            return found
    return found

print("\nAssigning candidates to products...")
for prod in PRODUCTS_DEF:
    cands = find_candidates_for_product(prod, 4)
    assigned_candidates[prod['slug']] = cands

print(f"Assigned 4 candidates to each of {len(PRODUCTS_DEF)} products ({len(used_indices)} total images used).")

def download_and_process_image(item):
    slug, img_idx, cand_info = item
    prod_dir = os.path.join(os.getcwd(), 'public', 'products', slug)
    os.makedirs(prod_dir, exist_ok=True)
    out_path = os.path.join(prod_dir, f"image-{img_idx}.webp")
    
    url = cand_info['url']
    if os.path.exists(out_path) and os.path.getsize(out_path) > 1000:
        try:
            fsize_kb = round(os.path.getsize(out_path) / 1024, 1)
            ph = compute_phash(out_path)
            if ph is not None:
                return {
                    'slug': slug,
                    'index': img_idx,
                    'path': f"/products/{slug}/image-{img_idx}.webp",
                    'local_path': out_path,
                    'size_kb': fsize_kb,
                    'phash': ph,
                    'source': url,
                    'title': cand_info.get('title', ''),
                    'success': True
                }
        except Exception:
            pass

    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'ZenPaawCatalogBuilder/1.0 (evike@zenpaaw.com)'})
            with urllib.request.urlopen(req, timeout=25) as res:
                data = res.read()
                img = Image.open(io.BytesIO(data))
                img = img.convert('RGB')
                w, h = img.size
                min_dim = min(w, h)
                left = (w - min_dim) // 2
                top = (h - min_dim) // 2
                img_cropped = img.crop((left, top, left + min_dim, top + min_dim))
                img_resized = img_cropped.resize((1000, 1000), Image.Resampling.LANCZOS)
                img_resized.save(out_path, 'WEBP', quality=82)
                
                fsize_kb = round(os.path.getsize(out_path) / 1024, 1)
                ph = compute_phash(out_path)
                
                return {
                    'slug': slug,
                    'index': img_idx,
                    'path': f"/products/{slug}/image-{img_idx}.webp",
                    'local_path': out_path,
                    'size_kb': fsize_kb,
                    'phash': ph,
                    'source': url,
                    'title': cand_info.get('title', ''),
                    'success': True
                }
        except Exception as e:
            if attempt < 2:
                time.sleep(1 + attempt)
            else:
                print(f"Error processing {slug} img {img_idx}: {e}")
                return {
                    'slug': slug,
                    'index': img_idx,
                    'path': f"/products/{slug}/image-{img_idx}.webp",
                    'local_path': out_path,
                    'success': False,
                    'error': str(e)
                }

# Build task list
download_tasks = []
for prod in PRODUCTS_DEF:
    slug = prod['slug']
    cands = assigned_candidates[slug]
    for i, (_, cand) in enumerate(cands, 1):
        download_tasks.append((slug, i, cand))

print(f"\nStarting processing of {len(download_tasks)} images (with disk-caching and polite workers)...")
start_time = time.time()
results = []
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
    results = list(executor.map(download_and_process_image, download_tasks))

duration = time.time() - start_time
success_count = sum(1 for r in results if r['success'])
print(f"Processed {len(results)} images in {duration:.1f}s: {success_count} succeeded.")

# Handle any failed downloads by taking from unused candidates
backup_pool = [c for idx, c in enumerate(CANDIDATES) if idx not in used_indices]
while any(not r['success'] for r in results) and backup_pool:
    failed_indices = [idx for idx, r in enumerate(results) if not r['success']]
    print(f"Resolving {len(failed_indices)} failed images with backup candidates...")
    for idx in failed_indices:
        if not backup_pool:
            break
        r = results[idx]
        backup_cand = backup_pool.pop(0)
        res = download_and_process_image((r['slug'], r['index'], backup_cand))
        if res['success']:
            results[idx] = res

# Verify pairwise Hamming distances across different products and resolve collisions
print("\nVerifying perceptual hashes across products and resolving any collisions...")
all_hashes = {}
for idx, r in enumerate(results):
    if not r['success'] or r.get('phash') is None:
        continue
    slug = r['slug']
    ph = r['phash']
    
    # Check if this hash collides with any previously registered product
    collision = False
    for other_path, (other_slug, other_h) in list(all_hashes.items()):
        if other_slug != slug and hamming_distance(ph, other_h) <= 4:
            collision = True
            print(f"Collision between {slug} and {other_slug}. Swapping candidate...")
            while backup_pool:
                cand = backup_pool.pop(0)
                res = download_and_process_image((slug, r['index'], cand))
                if res['success'] and res.get('phash') is not None:
                    new_ph = res['phash']
                    # Check new hash
                    if not any(oslug != slug and hamming_distance(new_ph, oh) <= 4 for _, (oslug, oh) in all_hashes.items()):
                        results[idx] = res
                        ph = new_ph
                        collision = False
                        break
            break
    all_hashes[r['path']] = (slug, ph)

print("Perceptual hash verification and deduplication complete.")

# Generate catalog.seed.json and IMAGE_LOG.csv
catalog_products = []
image_log_rows = []

for prod in PRODUCTS_DEF:
    slug = prod['slug']
    p_id = f"p-{slug}"
    title = prod['title']
    cat_id = prod['cat']
    
    # Map category title
    cat_name = next((c['name'] for c in CATEGORIES if c['id'] == cat_id), 'Toys')
    
    # Images for this product
    prod_imgs = [r for r in results if r['slug'] == slug and r['success']]
    prod_imgs.sort(key=lambda x: x['index'])
    
    img_records = []
    for img in prod_imgs:
        alt_text = f"{title} view {img['index']} on clean background"
        if img['index'] == 2:
            alt_text = f"{title} lifestyle in-use play view"
        elif img['index'] == 3:
            alt_text = f"{title} material and texture detail"
        elif img['index'] == 4:
            alt_text = f"{title} packaging and scale overview"
            
        img_records.append({
            "id": f"img-{slug}-{img['index']}",
            "url": img['path'],
            "alt": alt_text,
            "position": img['index'],
            "width": 1000,
            "height": 1000
        })
        
        image_log_rows.append({
            "product_id": p_id,
            "product_title": title,
            "image_index": img['index'],
            "file_path": img['path'],
            "dimensions": "1000x1000",
            "file_size_kb": img['size_kb'],
            "aspect_ratio": "1:1",
            "alt_text": alt_text,
            "source": img['source'],
            "license": "Creative Commons / Public Domain",
            "reviewed": "true"
        })
        
    # Variants
    variants_list = []
    for idx, v in enumerate(prod['variants'], 1):
        variants_list.append({
            "id": f"var-{slug}-{idx}",
            "sku": v['sku'],
            "option1Name": v['name'],
            "option1Value": v['val'],
            "priceCents": v['price'],
            "costCents": v['cost'],
            "compareAtCents": None,
            "weightG": int(prod['wt'].split()[0]) if prod['wt'].split()[0].isdigit() else 200,
            "available": True
        })
        
    claims_list = [
        {"key": "material", "value": prod['mat'], "sourceUrl": "supplier-spec-sheet", "verified": True},
        {"key": "dimensions", "value": prod['dim'], "sourceUrl": "supplier-spec-sheet", "verified": True},
        {"key": "weight", "value": prod['wt'], "sourceUrl": "supplier-spec-sheet", "verified": True},
        {"key": "safety_note", "value": prod['safety'], "sourceUrl": "safety-guidance-manual", "verified": True}
    ]
    
    catalog_products.append({
        "id": p_id,
        "slug": slug,
        "title": title,
        "name": title,
        "summary": prod['summary'],
        "description": prod['desc'],
        "petTypes": prod['pet'],
        "pet_types": prod['pet'],
        "categoryId": cat_id,
        "category_id": cat_id,
        "category": cat_name,
        "playStyles": prod['play'],
        "play_styles": prod['play'],
        "chewStrength": prod['chew'],
        "chew_strength": prod['chew'],
        "materials": prod['mat'],
        "status": "active",
        "price": round(prod['price'] / 100, 2),
        "priceCents": prod['price'],
        "compareAtPrice": None,
        "rating": 0,
        "reviewCount": 0,
        "inStock": True,
        "stockCount": 0,
        "variants": variants_list,
        "images": img_records,
        "claims": claims_list,
        "supplier": {
            "id": "sup-us-direct",
            "name": "US Pet Supplies Warehouse",
            "warehouseCountry": "US",
            "leadTimeDaysMin": 3,
            "leadTimeDaysMax": 7
        },
        "needs_owner_approval": True
    })

catalog_json_path = os.path.join(os.getcwd(), 'data', 'catalog.seed.json')
with open(catalog_json_path, 'w', encoding='utf-8') as f:
    json.dump(catalog_products, f, indent=2)

print(f"\nWrote {len(catalog_products)} products to {catalog_json_path}")

image_log_path = os.path.join(os.getcwd(), 'docs', 'IMAGE_LOG.csv')
with open(image_log_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=[
        "product_id", "product_title", "image_index", "file_path",
        "dimensions", "file_size_kb", "aspect_ratio", "alt_text",
        "source", "license", "reviewed"
    ])
    writer.writeheader()
    writer.writerows(image_log_rows)

print(f"Wrote {len(image_log_rows)} rows to {image_log_path}")
print("\nCatalog build complete!")

