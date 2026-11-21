/* Exp 8: Disk Scheduling - FCFS, SSTF, SCAN, C-SCAN with total seek time. */
#include <stdio.h>
#include <stdlib.h>
#define N 8
int abs_i(int x){ return x < 0 ? -x : x; }
void fcfs(int req[], int head) {
int total = 0, cur = head;
printf("\n--- FCFS ---\nSeek order: %d", cur);
for (int i = 0; i < N; i++) { total += abs_i(req[i]-cur); cur = req[i]; printf(" -> %d", cur); }
printf("\nTotal seek time = %d\n", total);
}
void sstf(int req[], int head) {
int r[N], done[N] = {0}, cur = head, total = 0;
for (int i = 0; i < N; i++) r[i] = req[i];
printf("\n--- SSTF ---\nSeek order: %d", cur);
for (int c = 0; c < N; c++) {
int idx = -1, best = 1e9;
for (int i = 0; i < N; i++)
if (!done[i] && abs_i(r[i]-cur) < best) { best = abs_i(r[i]-cur); idx = i; }
done[idx] = 1; total += best; cur = r[idx]; printf(" -> %d", cur);
}
printf("\nTotal seek time = %d\n", total);
}
void scan(int req[], int head, int disk) {
int r[N+2], n = 0, cur = head, total = 0;
for (int i = 0; i < N; i++) r[n++] = req[i];
r[n++] = 0; r[n++] = disk-1; /* go to both disk ends */
for (int i = 0; i < n-1; i++) /* sort ascending */
for (int j = 0; j < n-1-i; j++)
if (r[j] > r[j+1]) { int t=r[j]; r[j]=r[j+1]; r[j+1]=t; }
int pos = 0; while (r[pos] < head) pos++;
printf("\n--- SCAN (moving towards larger end) ---\nSeek order: %d", cur);
for (int i = pos; i < n; i++) { if (r[i]==head) continue; total += abs_i(r[i]-cur); cur = r[i];
printf(" -> %d", cur); }
for (int i = pos-1; i >= 0; i--) { total += abs_i(r[i]-cur); cur = r[i]; printf(" -> %d", cur); }
printf("\nTotal seek time = %d\n", total);
}
void cscan(int req[], int head, int disk) {
int r[N+2], n = 0, cur = head, total = 0;
for (int i = 0; i < N; i++) r[n++] = req[i];
r[n++] = 0; r[n++] = disk-1;
for (int i = 0; i < n-1; i++)
for (int j = 0; j < n-1-i; j++)
if (r[j] > r[j+1]) { int t=r[j]; r[j]=r[j+1]; r[j+1]=t; }
int pos = 0; while (r[pos] < head) pos++;
printf("\n--- C-SCAN ---\nSeek order: %d", cur);
for (int i = pos; i < n; i++) { if (r[i]==head) continue; total += abs_i(r[i]-cur); cur = r[i];
printf(" -> %d", cur); }
total += abs_i(cur-0); cur = 0; printf(" -> 0"); /* jump to start */
for (int i = 0; i < pos; i++) { if (r[i]==cur) continue; total += abs_i(r[i]-cur); cur = r[i];
printf(" -> %d", cur); }
printf("\nTotal seek time = %d\n", total);
}
int main() {
int req[N] = {98, 183, 37, 122, 14, 124, 65, 67};
int head = 53, disk = 200;
printf("Requests: 98 183 37 122 14 124 65 67\nHead start = %d, Disk size = %d\n", head, disk);
fcfs(req, head);
sstf(req, head);
scan(req, head, disk);
cscan(req, head, disk);
return 0;
}
