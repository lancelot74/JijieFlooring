#!/usr/bin/env bash
# Fetch product images + info from a clewm category QR and append rows to tools/online.tsv.
# Usage: tools/online-fetch.sh <category>   (re-runnable; dedups by sub-id via tools/online.seen)
# Hardened: retries + pacing to survive qr71.cn rate-limiting.
set -uo pipefail
cd "$(dirname "$0")/.."
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
CAT="${1:?category}"
case "$CAT" in
  birch-chevron)     URL="https://qr71.cn/ohCm4d/qPMYt1H"; COLL=plank;   FAM=Chevron;       SP=Birch; NM="Birch · Chevron";;
  birch-herringbone) URL="https://qr71.cn/ohCm4d/qL0qzcu"; COLL=plank;   FAM=Herringbone;   SP=Birch; NM="Birch · Herringbone";;
  oak-wide-chevron)  URL="http://qr71.cn/ohCm4d/qcgamDC";  COLL=plank;   FAM=Chevron;       SP=Oak;   NM="Oak · Chevron";;
  sawtooth)          URL="https://qr71.cn/ohCm4d/qJlNq0Y"; COLL=plank;   FAM=Sawtooth;      SP=Oak;   NM="Oak · Sawtooth";;
  shaped-inlay)      URL="https://qr71.cn/ohCm4d/qCUNbAo"; COLL=artistic;FAM="Shaped Inlay"; SP="";    NM="Shaped Inlay";;
  *) echo "unknown category: $CAT"; exit 1;;
esac

mkdir -p assets/img/grid assets/img/detail tools
SEEN=tools/online.seen; TSV=tools/online.tsv; touch "$SEEN" "$TSV"

getimg() { # $1 suburl -> echoes first image url or empty (retries md, then og)
  local s="$1" img="" t
  for t in 1 2 3; do
    img=$(curl -sSL -A "$UA" --max-time 25 --retry 2 --retry-delay 1 "$s?format=md" 2>/dev/null | grep -oE 'https?://ncstatic[a-zA-Z0-9./_-]+\.(jpg|jpeg|png)' | head -1)
    [ -n "$img" ] && { echo "$img"; return; }
    sleep 2
  done
  for t in 1 2; do
    img=$(curl -sSL -A "$UA" --max-time 20 --retry 2 --retry-delay 1 "$s" 2>/dev/null | grep -oE 'og:image" content="[^"]*"' | head -1 | sed -E 's/.*content="([^"]*)"/\1/')
    [ -n "$img" ] && { echo "$img"; return; }
    sleep 2
  done
  echo ""
}

md=$(curl -sSL -A "$UA" --max-time 40 --retry 3 --retry-delay 2 "$URL?format=md" 2>/dev/null)
pairs=$(echo "$md" | perl -0777 -ne 'while(/\[\s*([^\]\[]+?)\s*\]\(navLink:([^)?]+)/g){ $t=$1;$u=$2; $t=~s/\s+/ /g; print "$t\t$u\n" }')

ok=0; skip=0
while IFS=$'\t' read -r text suburl; do
  [ -z "${suburl:-}" ] && continue
  subid="${suburl##*/}"
  grep -qxF "$subid" "$SEEN" && continue
  code=$(echo "$text" | grep -oE '^[A-Za-z0-9][A-Za-z0-9.-]*' | head -1)
  size=$(echo "$text" | grep -oiE '[0-9]+x[0-9]+x[0-9.]+(/[0-9.]+)?(mm)?' | head -1)
  fam="$FAM"; nm="$NM"
  if [ "$CAT" = "sawtooth" ] && echo "$text" | grep -q '鱼骨拼'; then fam="Chevron"; nm="Oak · Chevron"; fi
  [ -z "$code" ] && code="$subid"
  img=$(getimg "$suburl")
  if [ -z "$img" ]; then echo "  skip(no-img) $code"; skip=$((skip+1)); sleep 1; continue; fi
  if ! curl -sSL -A "$UA" --max-time 50 --retry 3 --retry-delay 2 -o /tmp/onl.jpg "$img" 2>/dev/null; then echo "  skip(dl) $code"; skip=$((skip+1)); sleep 1; continue; fi
  identify /tmp/onl.jpg >/dev/null 2>&1 || { echo "  skip(badimg) $code"; skip=$((skip+1)); sleep 1; continue; }
  convert /tmp/onl.jpg -resize '500x500^' -gravity center -extent 500x500 -strip -interlace Plane -quality 80 "assets/img/grid/$subid.jpg"
  convert /tmp/onl.jpg -resize '1000x1000>' -strip -interlace Plane -quality 84 "assets/img/detail/$subid.jpg"
  printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\n' "$subid" "$code" "$nm" "$size" "$COLL" "$fam" "$SP" >> "$TSV"
  echo "$subid" >> "$SEEN"
  ok=$((ok+1))
  sleep 1
done <<< "$pairs"
echo "[$CAT] added=$ok skipped=$skip  (tsv total: $(wc -l < "$TSV"))"
