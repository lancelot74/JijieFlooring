#!/usr/bin/env bash
# Generate web-optimized images + products.js from the source catalogue.
# Re-runnable. Requires ImageMagick `convert`.
set -euo pipefail
cd "$(dirname "$0")/.."

SRC="_source_images"
GEO="$SRC/多层实木拼花地板"
ART="$SRC/异型拼花"
GRID="assets/img/grid"
DETAIL="assets/img/detail"
mkdir -p "$GRID" "$DETAIL" assets/js

# src|slug|name|code|collection|family|species
DATA=$(cat <<'EOF'
多层实木拼花地板/大叶花梨16凡尔赛.jpg|rosewood-versailles-16|Rosewood · Versailles|16|geometric|Versailles|Rosewood
多层实木拼花地板/柚木15凡尔赛.jpg|teak-versailles-15|Teak · Versailles|15|geometric|Versailles|Teak
多层实木拼花地板/柚木25 安妮公主.jpg|teak-princess-anne-25|Teak · Princess Anne|25|geometric|Princess Anne|Teak
多层实木拼花地板/柚木66八角星.jpg|teak-octagon-star-66|Teak · Octagon Star|66|geometric|Octagon Star|Teak
多层实木拼花地板/柚木977钻石.jpg|teak-diamond-977|Teak · Diamond|977|geometric|Diamond|Teak
多层实木拼花地板/棋盘格2.jpg|oak-checkerboard-2|Oak · Checkerboard|2|geometric|Checkerboard|Oak
多层实木拼花地板/棋盘格3.jpg|oak-checkerboard-3|Oak · Checkerboard|3|geometric|Checkerboard|Oak
多层实木拼花地板/棋盘格6.jpg|oak-checkerboard-6|Oak · Checkerboard|6|geometric|Checkerboard|Oak
多层实木拼花地板/棋盘格7.jpg|oak-checkerboard-7|Oak · Checkerboard|7|geometric|Checkerboard|Oak
多层实木拼花地板/棋盘格9.jpg|oak-checkerboard-9|Oak · Checkerboard|9|geometric|Checkerboard|Oak
多层实木拼花地板/橡木10凡尔赛 (1).jpg|oak-versailles-10|Oak · Versailles|10|geometric|Versailles|Oak
多层实木拼花地板/橡木11凡尔赛 (2).jpg|oak-versailles-11|Oak · Versailles|11|geometric|Versailles|Oak
多层实木拼花地板/橡木21安妮公主.jpg|oak-princess-anne-21|Oak · Princess Anne|21|geometric|Princess Anne|Oak
多层实木拼花地板/橡木5106凡尔赛.jpg|oak-versailles-5106|Oak · Versailles|5106|geometric|Versailles|Oak
多层实木拼花地板/橡木61钻石.jpg|oak-diamond-61|Oak · Diamond|61|geometric|Diamond|Oak
多层实木拼花地板/橡木62钻石.jpg|oak-diamond-62|Oak · Diamond|62|geometric|Diamond|Oak
多层实木拼花地板/橡木975八角星.jpg|oak-octagon-star-975|Oak · Octagon Star|975|geometric|Octagon Star|Oak
多层实木拼花地板/橡木976八角星.jpg|oak-octagon-star-976|Oak · Octagon Star|976|geometric|Octagon Star|Oak
多层实木拼花地板/橡木977八角星.jpg|oak-octagon-star-977|Oak · Octagon Star|977|geometric|Octagon Star|Oak
多层实木拼花地板/橡木棋盘01.jpg|oak-checkerboard-01|Oak · Checkerboard|01|geometric|Checkerboard|Oak
多层实木拼花地板/白蜡木18凡尔赛.jpg|ash-versailles-18|Ash · Versailles|18|geometric|Versailles|Ash
多层实木拼花地板/鸡翅木20凡尔赛.jpg|wenge-versailles-20|Wenge · Versailles|20|geometric|Versailles|Wenge
多层实木拼花地板/黑胡桃12凡尔赛.jpg|black-walnut-versailles-12|Black Walnut · Versailles|12|geometric|Versailles|Black Walnut
多层实木拼花地板/黑胡桃22安妮公主.jpg|black-walnut-princess-anne-22|Black Walnut · Princess Anne|22|geometric|Princess Anne|Black Walnut
多层实木拼花地板/黑胡桃23安妮公主.jpg|black-walnut-princess-anne-23|Black Walnut · Princess Anne|23|geometric|Princess Anne|Black Walnut
多层实木拼花地板/黑胡桃978八角星.jpg|black-walnut-octagon-star-978|Black Walnut · Octagon Star|978|geometric|Octagon Star|Black Walnut
多层实木拼花地板/黑胡桃989钻石.jpg|black-walnut-diamond-989|Black Walnut · Diamond|989|geometric|Diamond|Black Walnut
异型拼花/30橡木橡木树叶.jpg|oak-leaf-30|Oak · Leaf|30|artistic|Leaf|Oak
异型拼花/60橡木花样.jpg|oak-floral-60|Oak · Floral|60|artistic|Floral|Oak
异型拼花/61黑胡桃花样.jpg|black-walnut-floral-61|Black Walnut · Floral|61|artistic|Floral|Black Walnut
异型拼花/62柚木花样.jpg|teak-floral-62|Teak · Floral|62|artistic|Floral|Teak
异型拼花/63桦木花样.jpg|birch-floral-63|Birch · Floral|63|artistic|Floral|Birch
异型拼花/708橡木小树叶.jpg|oak-leaf-708|Oak · Leaf|708|artistic|Leaf|Oak
异型拼花/716橡木五边形.jpg|oak-pentagon-716|Oak · Pentagon|716|artistic|Pentagon|Oak
异型拼花/71橡木荷花 (2).jpg|oak-lotus-71|Oak · Lotus|71|artistic|Lotus|Oak
异型拼花/720橡木中国结.jpg|oak-chinese-knot-720|Oak · Chinese Knot|720|artistic|Chinese Knot|Oak
异型拼花/75橡木树叶.jpg|oak-leaf-75|Oak · Leaf|75|artistic|Leaf|Oak
异型拼花/81黑胡桃荷花.jpg|black-walnut-lotus-81|Black Walnut · Lotus|81|artistic|Lotus|Black Walnut
异型拼花/82黑胡桃中国结.jpg|black-walnut-chinese-knot-82|Black Walnut · Chinese Knot|82|artistic|Chinese Knot|Black Walnut
异型拼花/87黑胡桃树叶.jpg|black-walnut-leaf-87|Black Walnut · Leaf|87|artistic|Leaf|Black Walnut
异型拼花/91柚木荷花.jpg|teak-lotus-91|Teak · Lotus|91|artistic|Lotus|Teak
异型拼花/92柚木中国结.jpg|teak-chinese-knot-92|Teak · Chinese Knot|92|artistic|Chinese Knot|Teak
异型拼花/95柚木树叶.jpg|teak-leaf-95|Teak · Leaf|95|artistic|Leaf|Teak
鱼骨拼1.2到3.0木皮/3611.jpg|oak-chevron-3611|Oak · Chevron|3611|plank|Chevron|Oak
鱼骨拼1.2到3.0木皮/3612.jpg|oak-chevron-3612|Oak · Chevron|3612|plank|Chevron|Oak
鱼骨拼1.2到3.0木皮/3613.jpg|oak-chevron-3613|Oak · Chevron|3613|plank|Chevron|Oak
鱼骨拼1.2到3.0木皮/3614.jpg|oak-chevron-3614|Oak · Chevron|3614|plank|Chevron|Oak
鱼骨拼1.2到3.0木皮/3615.jpg|oak-chevron-3615|Oak · Chevron|3615|plank|Chevron|Oak
鱼骨拼1.2到3.0木皮/3616.jpg|oak-chevron-3616|Oak · Chevron|3616|plank|Chevron|Oak
鱼骨拼1.2到3.0木皮/3617.jpg|oak-chevron-3617|Oak · Chevron|3617|plank|Chevron|Oak
1.2木皮到3.0木皮人字拼/3311.jpg|oak-herringbone-3311|Oak · Herringbone|3311|plank|Herringbone|Oak
1.2木皮到3.0木皮人字拼/3312.jpg|oak-herringbone-3312|Oak · Herringbone|3312|plank|Herringbone|Oak
1.2木皮到3.0木皮人字拼/3313.jpg|oak-herringbone-3313|Oak · Herringbone|3313|plank|Herringbone|Oak
1.2木皮到3.0木皮人字拼/3314.jpg|oak-herringbone-3314|Oak · Herringbone|3314|plank|Herringbone|Oak
1.2木皮到3.0木皮人字拼/3315.jpg|oak-herringbone-3315|Oak · Herringbone|3315|plank|Herringbone|Oak
1.2木皮到3.0木皮人字拼/3316.jpg|oak-herringbone-3316|Oak · Herringbone|3316|plank|Herringbone|Oak
1.2木皮到3.0木皮人字拼/3317.jpg|oak-herringbone-3317|Oak · Herringbone|3317|plank|Herringbone|Oak
人字拼2.0到3.0木皮/201.jpg|oak-herringbone-201|Oak · Herringbone|201|plank|Herringbone|Oak
人字拼2.0到3.0木皮/202.jpg|oak-herringbone-202|Oak · Herringbone|202|plank|Herringbone|Oak
人字拼2.0到3.0木皮/203.jpg|oak-herringbone-203|Oak · Herringbone|203|plank|Herringbone|Oak
人字拼2.0到3.0木皮/205.jpg|oak-herringbone-205|Oak · Herringbone|205|plank|Herringbone|Oak
人字拼2.0到3.0木皮/206.jpg|oak-herringbone-206|Oak · Herringbone|206|plank|Herringbone|Oak
人字拼2.0到3.0木皮/207.jpg|oak-herringbone-207|Oak · Herringbone|207|plank|Herringbone|Oak
人字拼2.0到3.0木皮/208.jpg|oak-herringbone-208|Oak · Herringbone|208|plank|Herringbone|Oak
人字拼2.0到3.0木皮/209.jpg|oak-herringbone-209|Oak · Herringbone|209|plank|Herringbone|Oak
人字拼2.0到3.0木皮/210.jpg|oak-herringbone-210|Oak · Herringbone|210|plank|Herringbone|Oak
人字拼2.0到3.0木皮/211.jpg|oak-herringbone-211|Oak · Herringbone|211|plank|Herringbone|Oak
人字拼2.0到3.0木皮/212.jpg|oak-herringbone-212|Oak · Herringbone|212|plank|Herringbone|Oak
人字拼2.0到3.0木皮/213.jpg|oak-herringbone-213|Oak · Herringbone|213|plank|Herringbone|Oak
人字拼2.0到3.0木皮/215.jpg|oak-herringbone-215|Oak · Herringbone|215|plank|Herringbone|Oak
人字拼2.0到3.0木皮/216.jpg|oak-herringbone-216|Oak · Herringbone|216|plank|Herringbone|Oak
人字拼2.0到3.0木皮/218.jpg|oak-herringbone-218|Oak · Herringbone|218|plank|Herringbone|Oak
1.2米长板/3001.jpg|oak-long-plank-3001|Oak · Long Plank|3001|plank|Long Plank|Oak
1.2米长板/302.jpg|oak-long-plank-302|Oak · Long Plank|302|plank|Long Plank|Oak
1.2米长板/303.jpg|oak-long-plank-303|Oak · Long Plank|303|plank|Long Plank|Oak
1.2米长板/305.jpg|oak-long-plank-305|Oak · Long Plank|305|plank|Long Plank|Oak
1.2米长板/306.jpg|oak-long-plank-306|Oak · Long Plank|306|plank|Long Plank|Oak
1.2米长板/307.jpg|oak-long-plank-307|Oak · Long Plank|307|plank|Long Plank|Oak
1.2到3.0木皮长板/6811.jpg|oak-long-plank-6811|Oak · Long Plank|6811|plank|Long Plank|Oak
1.2到3.0木皮长板/6812.jpg|oak-long-plank-6812|Oak · Long Plank|6812|plank|Long Plank|Oak
1.2到3.0木皮长板/6813.jpg|oak-long-plank-6813|Oak · Long Plank|6813|plank|Long Plank|Oak
1.2到3.0木皮长板/6814.jpg|oak-long-plank-6814|Oak · Long Plank|6814|plank|Long Plank|Oak
1.2到3.0木皮长板/6815.jpg|oak-long-plank-6815|Oak · Long Plank|6815|plank|Long Plank|Oak
1.2到3.0木皮长板/6916.jpg|oak-long-plank-6916|Oak · Long Plank|6916|plank|Long Plank|Oak
1.2到3.0木皮长板/6917.jpg|oak-long-plank-6917|Oak · Long Plank|6917|plank|Long Plank|Oak
3.0,木皮长板/201.jpg|oak-long-plank-201|Oak · Long Plank|201|plank|Long Plank|Oak
3.0,木皮长板/202.jpg|oak-long-plank-202|Oak · Long Plank|202|plank|Long Plank|Oak
3.0,木皮长板/203.jpg|oak-long-plank-203|Oak · Long Plank|203|plank|Long Plank|Oak
3.0,木皮长板/204.jpg|oak-long-plank-204|Oak · Long Plank|204|plank|Long Plank|Oak
3.0,木皮长板/5001.jpg|oak-long-plank-5001|Oak · Long Plank|5001|plank|Long Plank|Oak
3.0,木皮长板/508.jpg|oak-long-plank-508|Oak · Long Plank|508|plank|Long Plank|Oak
EOF
)

JS="assets/js/products.js"
echo "// Auto-generated by tools/build-images.sh — do not edit by hand." > "$JS"
echo "window.PRODUCTS = [" >> "$JS"

count=0
while IFS='|' read -r src slug name code collection family species; do
  [ -z "$src" ] && continue
  if [ ! -f "$SRC/$src" ]; then echo "MISSING: $SRC/$src" >&2; exit 1; fi
  convert "$SRC/$src" -resize 500x500 -strip -interlace Plane -quality 80 "$GRID/$slug.jpg"
  convert "$SRC/$src" -resize "1000x1000>" -strip -interlace Plane -quality 84 "$DETAIL/$slug.jpg"
  printf '  { slug: "%s", name: "%s", code: "%s", collection: "%s", family: "%s", species: "%s" },\n' \
    "$slug" "$name" "$code" "$collection" "$family" "$species" >> "$JS"
  count=$((count+1))
done <<< "$DATA"

echo "];" >> "$JS"
echo "Built $count products → grid + detail images and $JS"
du -sh "$GRID" "$DETAIL" 2>/dev/null
