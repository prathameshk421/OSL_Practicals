/* Exp 7: Page Replacement - FIFO, LRU, and Optimal.
Tracks page faults for a reference string and given number of frames. */
#include <stdio.h>
#include <limits.h>
int ref[] = {7,0,1,2,0,3,0,4,2,3,0,3,2,1,2,0,1,7,0,1};
int RS, FR = 3;
void show(int f[], int n) {
printf(" Frames: ");
for (int i = 0; i < n; i++)
if (f[i] == -1) printf("- "); else printf("%d ", f[i]);
printf("\n");
}
void fifo() {
int f[10], n = FR, ptr = 0, faults = 0;
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
int f[10], last[10], n = FR, faults = 0;
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
int f[10], n = FR, faults = 0;
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
int main() {
RS = sizeof(ref)/sizeof(ref[0]);
printf("Reference string: ");
for (int i = 0; i < RS; i++) printf("%d ", ref[i]);
printf("\nNumber of frames = %d\n", FR);
fifo(); lru(); optimal();
return 0;
}
