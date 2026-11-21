/* Exp 7: Page Replacement - FIFO, LRU, and Optimal.
Tracks page faults for a reference string and given number of frames. */
#include <stdio.h>
#include <limits.h>
#include <stdlib.h>
#include <errno.h>
#include <ctype.h>
#define MAX_REFERENCES 10000
#define MAX_FRAMES 100
int ref[MAX_REFERENCES];
int RS, FR;
void show(int f[], int n) {
printf(" Frames: ");
for (int i = 0; i < n; i++)
if (f[i] == -1) printf("- "); else printf("%d ", f[i]);
printf("\n");
}
void fifo() {
int f[MAX_FRAMES], n = FR, ptr = 0, faults = 0;
for (int i = 0; i < n; i++) f[i] = -1;
printf("\n===== FIFO =====\n");
for (int i = 0; i < RS; i++) {
int hit = 0;
for (int j = 0; j < n; j++) if (f[j] == ref[i]) hit = 1;
if (!hit) { f[ptr] = ref[i]; ptr = (ptr+1)%n; faults++;
printf("Ref %d -> FAULT", ref[i]); }
else printf("Ref %d -> hit ", ref[i]);
show(f, n);
}
printf("Total Page Faults (FIFO) = %d\n", faults);
}
void lru() {
int f[MAX_FRAMES], last[MAX_FRAMES], n = FR, faults = 0;
for (int i = 0; i < n; i++) { f[i] = -1; last[i] = -1; }
printf("\n===== LRU =====\n");
for (int i = 0; i < RS; i++) {
int hit = -1;
for (int j = 0; j < n; j++) if (f[j] == ref[i]) hit = j;
if (hit == -1) {
int lru = 0;
for (int j = 1; j < n; j++) if (last[j] < last[lru]) lru = j;
f[lru] = ref[i]; last[lru] = i; faults++;
printf("Ref %d -> FAULT", ref[i]);
} else { last[hit] = i; printf("Ref %d -> hit ", ref[i]); }
show(f, n);
}
printf("Total Page Faults (LRU) = %d\n", faults);
}
void optimal() {
int f[MAX_FRAMES], n = FR, faults = 0;
for (int i = 0; i < n; i++) f[i] = -1;
printf("\n===== Optimal =====\n");
for (int i = 0; i < RS; i++) {
int hit = 0;
for (int j = 0; j < n; j++) if (f[j] == ref[i]) hit = 1;
if (!hit) {
int idx = -1, farthest = -1;
for (int j = 0; j < n; j++) {
if (f[j] == -1) { idx = j; break; }
int k;
for (k = i+1; k < RS; k++) if (ref[k] == f[j]) break;
if (k > farthest) { farthest = k; idx = j; }
}
f[idx] = ref[i]; faults++;
printf("Ref %d -> FAULT", ref[i]);
} else printf("Ref %d -> hit ", ref[i]);
show(f, n);
}
printf("Total Page Faults (Optimal) = %d\n", faults);
}
/* Read a whole integer token; reject malformed or out-of-range input. */
int read_integer(int *value) {
    char token[64], *end;
    long parsed;
    if (scanf("%63s", token) != 1) return 0;
    int next = getchar();
    if (next != EOF && !isspace((unsigned char)next)) {
        while (next != EOF && !isspace((unsigned char)next)) next = getchar();
        return 0;
    }
    errno = 0;
    parsed = strtol(token, &end, 10);
    if (errno || *end != '\0' || parsed < 0 || parsed > INT_MAX) return 0;
    *value = (int)parsed;
    return 1;
}
int main(void) {
    printf("Enter number of page references (1-%d): ", MAX_REFERENCES);
    if (!read_integer(&RS) || RS < 1 || RS > MAX_REFERENCES) {
        fprintf(stderr, "Invalid reference count.\n"); return 1;
    }
    printf("Enter %d non-negative page numbers: ", RS);
    for (int i = 0; i < RS; ++i) {
        if (!read_integer(&ref[i])) {
            fprintf(stderr, "Invalid page number at position %d.\n", i + 1);
            return 1;
        }
    }
    printf("Enter number of frames (1-%d): ", MAX_FRAMES);
    if (!read_integer(&FR) || FR < 1 || FR > MAX_FRAMES) {
        fprintf(stderr, "Invalid frame count.\n"); return 1;
    }
    printf("Reference string: ");
    for (int i = 0; i < RS; i++) printf("%d ", ref[i]);
    printf("\nNumber of frames = %d\n", FR);
    fifo(); lru(); optimal();
    return 0;
}
