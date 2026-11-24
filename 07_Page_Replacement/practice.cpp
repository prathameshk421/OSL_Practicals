#include <algorithm>
#include <iostream>
#include <vector>

using namespace std;

void print_f(vector<int> &f, int frames) {
    cout << "\nFrames:\n";
    for (int i = 0; i < frames; i++) {
        cout << f[i] << ' ';
    }
    cout << '\n';
}

void fifo(vector<int> &ref, int n, int frames) {
    cout << "\n===== FIFO =====\n";
    vector<int> f(frames, -1);
    int ptr = 0;
    int faults = 0;
    for (int i = 0; i < n; i++) {
        int found = 0;
        for (int j = 0; j < frames; j++) {
            if (ref[i] == f[j]) {
                cout << "\nPage Hit!!!\n";
                found = 1;
                break;
            }
        }
        if (!found) {
            cout << "\nPage Fault!!\n";
            f[ptr] = ref[i];
            ptr = (ptr + 1) % frames;
            faults++;
        }
        print_f(f, frames);
    }
    cout << "\nTotal Page Faults (FIFO): " << faults << '\n';
}

void lru(vector<int> &ref, int n, int frames) {
    cout << "\n===== LRU =====\n";
    vector<int> f(frames, -1);
    vector<int> last_used(frames, -1);
    int faults = 0;
    for (int i = 0; i < n; i++) {
        int found = 0;
        for (int j = 0; j < frames; j++) {
            if (ref[i] == f[j]) {
                cout << "\nPage Hit!!!\n";
                last_used[j] = i;
                found = 1;
                break;
            }
        }
        if (!found) {
            cout << "\nPage Fault!!\n";
            faults++;
            int done = 0;
            for (int j = 0; j < frames; j++) {
                if (f[j] == -1) {
                    f[j] = ref[i];
                    last_used[j] = i;
                    done = 1;
                    break;
                }
            }
            if (!done) {
                int min_index = min_element(last_used.begin(), last_used.end()) - last_used.begin();
                f[min_index] = ref[i];
                last_used[min_index] = i;
            }
        }
        print_f(f, frames);
    }
    cout << "\nTotal Page Faults (LRU): " << faults << '\n';
}

void optimal(vector<int> &ref, int n, int frames) {
    cout << "\n===== OPTIMAL =====\n";
    vector<int> f(frames, -1);
    int faults = 0;
    for (int i = 0; i < n; i++) {
        int found = 0;
        for (int j = 0; j < frames; j++) {
            if (ref[i] == f[j]) {
                cout << "\nPage Hit!!!\n";
                found = 1;
                break;
            }
        }
        if (!found) {
            cout << "\nPage Fault!!\n";
            faults++;
            int victim = -1;
            int farthest = -1;
            for (int j = 0; j < frames; j++) {
                if (f[j] == -1) {
                    victim = j;
                    break;
                }
                int k = i + 1;
                while (k < n && ref[k] != f[j]) k++;
                if (k > farthest) {
                    farthest = k;
                    victim = j;
                }
            }
            f[victim] = ref[i];
        }
        print_f(f, frames);
    }
    cout << "\nTotal Page Faults (Optimal): " << faults << '\n';
}

int main() {
    int n, frames;

    cout << "Enter number of pages in reference string: ";
    cin >> n;

    vector<int> ref(n);
    cout << "Enter the reference string (space separated): ";
    for (int i = 0; i < n; i++) {
        cin >> ref[i];
    }

    cout << "\nEnter number of frames: ";
    cin >> frames;

    fifo(ref, n, frames);
    lru(ref, n, frames);
    optimal(ref, n, frames);

    return 0;
}
