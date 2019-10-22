#include <numeric>
#include <vector>
#include <string>
#include <array>
#include <napi.h>
#include <stdint.h>
#include <stdlib.h>
#include <stdio.h>
#include <string.h> /* memset */
#include <stdbool.h>
#include <stdio.h>
#include <time.h>


#define MIN(a,b) ((a) < (b) ? (a) : (b))
#define MAX(a,b) ((a) > (b) ? (a) : (b))

#define CEILDIV(a,b) (a / b + (a % b != 0))

#define BITMAP_GET(bm,i) (bm[i / 64] & ((uint64_t) 1 << (i % 64)))
#define BITMAP_SET(bm,i) (bm[i / 64] |= ((uint64_t) 1 << (i % 64)))
#define BITMAP_CLR(bm,i) (bm[i / 64] &= ~((uint64_t) 1 << (i % 64)))


/*
 * Myers' bit-parallel algorithm
 *
 * See: G. Myers. "A fast bit-vector algorithm for approximate string
 *      matching based on dynamic programming." Journal of the ACM, 1999.
 */
static uint64_t myers1999_geteq(uint64_t *Peq, uint64_t *map, uint64_t c)
{
    uint8_t h = c % 256;
    while (1) {
        if (map[h] == c)
            return Peq[h];
        if (map[h] == UINT64_MAX)
            return 0;
        h++;
    }
}

static void myers1999_setup(uint64_t *Peq, uint64_t *map, std::u16string& sb, uint64_t start, uint8_t len)
{
    uint64_t c;
    uint8_t h;

    memset(map, -1, sizeof(uint64_t) * 256);

    while (len--) {
        c = sb[start + len];
        h = c % 256;
        while (map[h] != UINT64_MAX && map[h] != c)
            h++;
        if (map[h] == UINT64_MAX) {
            map[h] = c;
            Peq[h] = 0;
        }
        Peq[h] |= (uint64_t) 1 << len;
    }
}

static uint64_t myers1999_simple(std::u16string& sb1, std::u16string& sb2)
{
    uint64_t sb1len = sb1.length();
    uint64_t sb2len = sb2.length();
    uint64_t Peq[256];
    uint64_t map[256];
    uint64_t Eq, Xv, Xh, Ph, Mh, Pv, Mv, Last;

    uint64_t idx, Score;

    Mv = 0;
    Pv = ~ (uint64_t) 0;
    Score = sb2len;
    Last = (uint64_t) 1 << (sb2len - 1);

    myers1999_setup(Peq, map, sb2, 0, sb2len);

    for (idx = 0; idx < sb1len; idx++) {
        Eq = myers1999_geteq(Peq, map, sb1[idx]);

        Xv = Eq | Mv;
        Xh = (((Eq & Pv) + Pv) ^ Pv) | Eq;

        Ph = Mv | ~ (Xh | Pv);
        Mh = Pv & Xh;

        if (Ph & Last)
            Score += 1;
        else if (Mh & Last)
            Score -= 1;

        Ph = (Ph << 1) | 1;
        Mh = (Mh << 1);

        Pv = Mh | ~ (Xv | Ph);
        Mv = Ph & Xv;
    }
    return Score;
}

static uint64_t myers1999_block(std::u16string& sb1, std::u16string& sb2, uint64_t b, uint64_t *Phc, uint64_t *Mhc)
{
    uint64_t sb1len = sb1.length();
    uint64_t sb2len = sb2.length();
    uint64_t Peq[256];
    uint64_t map[256];
    uint64_t Eq, Xv, Xh, Ph, Mh, Pv, Mv, Last;
    uint8_t Pb, Mb, vlen;

    uint64_t idx, start, Score;

    start = b * 64;
    vlen = MIN(64, sb2len - start);

    Mv = 0;
    Pv = ~ (uint64_t) 0;
    Score = sb2len;
    Last = (uint64_t) 1 << (vlen - 1);

    myers1999_setup(Peq, map, sb2, start, vlen);

    for (idx = 0; idx < sb1len; idx++) {
        Eq = myers1999_geteq(Peq, map, sb1[idx]);

        Pb = !!BITMAP_GET(Phc, idx);
        Mb = !!BITMAP_GET(Mhc, idx);

        Xv = Eq | Mv;
        Eq |= Mb;
        Xh = (((Eq & Pv) + Pv) ^ Pv) | Eq;

        Ph = Mv | ~ (Xh | Pv);
        Mh = Pv & Xh;

        if (Ph & Last) {
            BITMAP_SET(Phc, idx);
            Score++;
        } else {
            BITMAP_CLR(Phc, idx);
        }
        if (Mh & Last) {
            BITMAP_SET(Mhc, idx);
            Score--;
        } else {
            BITMAP_CLR(Mhc, idx);
        }

        Ph = (Ph << 1) | Pb;
        Mh = (Mh << 1) | Mb;

        Pv = Mh | ~ (Xv | Ph);
        Mv = Ph & Xv;
    }
    return Score;
}

static uint64_t myers1999(std::u16string& sb1, std::u16string& sb2)
{
    uint64_t sb1len = sb1.length();
    uint64_t sb2len = sb2.length();
    uint64_t i;
    uint64_t vmax, hmax;
    uint64_t *Phc, *Mhc;
    uint64_t res;

    if (sb2len == 0)
        return sb1len;

    if (sb2len <= 64)
        return myers1999_simple(sb1, sb2);

    hmax = CEILDIV(sb1len, 64);
    vmax = CEILDIV(sb2len, 64);

    Phc = (uint64_t*)malloc(hmax * sizeof(uint64_t));
    Mhc = (uint64_t*)malloc(hmax * sizeof(uint64_t));

    if (Phc == NULL || Mhc == NULL) {
        return -1;
    }

    for (i = 0; i < hmax; i++) {
        Mhc[i] = 0;
        Phc[i] = ~ (uint64_t) 0;
    }

    for (i = 0; i < vmax; i++)
        res = myers1999_block(sb1, sb2, i, Phc, Mhc);

    free(Phc);
    free(Mhc);

    return res;
}

unsigned int levenshtein(std::u16string& word, std::u16string& reference) {
  return myers1999(word, reference);
}


















//   if (word.size() > reference.size()) {
//     std::swap(word, reference); 
//   } 

//   int wL = word.length();
//   int rL = reference.length();

//   std::vector<int> buffer(wL);
  
//   int i = 0;
//   while (i < wL) {
//     buffer[i] = i + 1;
//     i++;
//   }

//   int d0, d1, d2, d3, dd, dy;
//   int ay, bx0, bx1, bx2, bx3;
//   i = 0;

//   while (i < rL - 3) {
//     bx0 = reference[d0 = i++];
//     bx1 = reference[d1 = i++];
//     bx2 = reference[d2 = i++];
//     bx3 = reference[d3 = i++];
//     dd = i;

//     int y = 0;
//     while (y < wL) {
//       dy = buffer[y];
//       ay = word[y];
//       d0 = _min(dy, d0, d1, bx0, ay);
//       d1 = _min(d0, d1, d2, bx1, ay);
//       d2 = _min(d1, d2, d3, bx2, ay);
//       dd = _min(d2, d3, dd, bx3, ay);
//       buffer[y] = dd;
//       d3 = d2;
//       d2 = d1;
//       d1 = d0;
//       d0 = dy;
//       y++;
//     }
//   }

//   while (i < rL) {
//     int code = reference[i];
//     int ins = i++;
//     dd = i;

//   int j = 0;
//   while (j < wL) {
//     int sub = code == word[j] ? ins - 1 : ins;
//     ins = buffer[j];
//     dd = buffer[j++] = (dd < sub ? (dd < ins ? dd : ins) : (sub < ins ? sub : ins)) + 1;
//     }
//   }
//  return dd;
// }
