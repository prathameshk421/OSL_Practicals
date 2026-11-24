#include <iostream>
#include <queue>
#include <string>
#include <vector>
using namespace std;

struct Process {
    int id, at, bt, pr;
};

void print_result(const string &title, const vector<Process> &p,
                  const vector<int> &ct, const vector<int> &tat,
                  const vector<int> &wt) {
    float twt = 0, ttat = 0;
    int n = p.size();
    cout << "\n--- " << title << " ---\n";
    cout << "PID\tAT\tBT\tPR\tCT\tTAT\tWT\n";
    for (int i = 0; i < n; i++) {
        cout << "P" << p[i].id << "\t" << p[i].at << "\t" << p[i].bt
             << "\t" << p[i].pr << "\t" << ct[i] << "\t" << tat[i]
             << "\t" << wt[i] << "\n";
        twt += wt[i];
        ttat += tat[i];
    }
    cout << "Avg WT: " << twt / n << "  |  Avg TAT: " << ttat / n << "\n";
}

// Unified scheduler for 1:FCFS, 2:SJF(NP), 3:SRTF(P), 4:Priority(NP), 5:Priority(P)
void schedule(const vector<Process> &p, int mode, const string &title) {
    int n = p.size();
    bool preemptive = (mode == 3 || mode == 5);
    vector<int> rem(n), ct(n), tat(n), wt(n);
    for (int i = 0; i < n; i++) rem[i] = p[i].bt;

    int done = 0, curr = -1;
    for (int t = 0; done < n; t++) {
        // Re-pick if CPU is free (NP) OR every tick (Preemptive)
        if (curr == -1 || preemptive) {
            curr = -1;
            for (int i = 0; i < n; i++) {
                if (p[i].at > t || rem[i] == 0) continue; // Not in ready queue
                if (curr == -1) { curr = i; continue; }

                int a = (mode == 1) ? p[i].at  : (mode == 2) ? p[i].bt  :
                        (mode == 3) ? rem[i]   : p[i].pr;
                int b = (mode == 1) ? p[curr].at : (mode == 2) ? p[curr].bt :
                        (mode == 3) ? rem[curr]  : p[curr].pr;

                if (a < b || (a == b && p[i].at < p[curr].at)) curr = i;
            }
        }
        if (curr == -1) continue; // CPU idle

        rem[curr]--;
        if (rem[curr] == 0) {
            ct[curr] = t + 1;
            tat[curr] = ct[curr] - p[curr].at;
            wt[curr] = tat[curr] - p[curr].bt;
            done++;
            curr = -1;
        }
    }
    print_result(title, p, ct, tat, wt);
}

// 6. Round Robin (Preemptive) with Arrival Time & FIFO Ready Queue
void round_robin(const vector<Process> &p, int q) {
    int n = p.size();
    vector<int> rem(n), ct(n), tat(n), wt(n);
    for (int i = 0; i < n; i++) rem[i] = p[i].bt;

    queue<int> rq;
    int done = 0, curr = -1, slice = 0;

    for (int t = 0; done < n; t++) {
        for (int i = 0; i < n; i++)
            if (p[i].at == t) rq.push(i); // Add newly arrived processes

        if (curr != -1 && slice == q) {   // Quantum expired -> back of queue
            rq.push(curr);
            curr = -1;
            slice = 0;
        }
        if (curr == -1 && !rq.empty()) {  // Pick next from queue
            curr = rq.front();
            rq.pop();
            slice = 0;
        }
        if (curr == -1) continue;         // CPU idle

        rem[curr]--;
        slice++;
        if (rem[curr] == 0) {
            ct[curr] = t + 1;
            tat[curr] = ct[curr] - p[curr].at;
            wt[curr] = tat[curr] - p[curr].bt;
            done++;
            curr = -1;
            slice = 0;
        }
    }
    print_result("Round Robin (q=" + to_string(q) + ")", p, ct, tat, wt);
}

int main() {
    int n, q;
    cout << "Enter number of processes: ";
    cin >> n;

    vector<Process> p(n);
    for (int i = 0; i < n; i++) {
        p[i].id = i + 1;
        cout << "Enter AT, BT, Priority for P" << p[i].id << ": ";
        cin >> p[i].at >> p[i].bt >> p[i].pr;
    }
    cout << "Enter time quantum for Round Robin: ";
    cin >> q;

    schedule(p, 1, "FCFS (Non-Preemptive)");
    schedule(p, 2, "SJF (Non-Preemptive)");
    schedule(p, 3, "SRTF (Preemptive SJF)");
    schedule(p, 4, "Priority (Non-Preemptive)");
    schedule(p, 5, "Priority (Preemptive)");
    round_robin(p, q);
    return 0;
}
