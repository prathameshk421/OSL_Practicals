#include <algorithm>
#include <climits>
#include <iostream>
#include <limits>
#include <queue>
#include <string>
#include <vector>
using namespace std;

struct Process {
    int id;
    int at;
    int bt;
    int pr;
};

int read_int(const string &prompt) {
    int x;
    while (true) {
        cout << prompt;
        if (cin >> x) return x;
        cin.clear();
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
        cout << "Invalid input, try again.\n";
    }
}

void print_result(const string &title, const vector<Process> &procs,
                  const vector<int> &ct, const vector<int> &tat,
                  const vector<int> &wt) {
    float twt = 0, ttat = 0;
    int n = procs.size();
    cout << "\n--- " << title << " ---\n";
    cout << "PID\tAT\tBT\tPR\tCT\tTAT\tWT\n";
    for (int i = 0; i < n; i++) {
        cout << procs[i].id << "\t" << procs[i].at << "\t" << procs[i].bt
             << "\t" << procs[i].pr << "\t" << ct[i] << "\t" << tat[i]
             << "\t" << wt[i] << "\n";
        twt += wt[i];
        ttat += tat[i];
    }
    cout << "Avg Waiting Time: " << (twt / n)
         << "\nAvg Turnaround Time: " << (ttat / n) << "\n";
}

// 1. FCFS (Non-Preemptive) with Arrival Time
void fcfs(const vector<Process> &procs) {
    int n = procs.size();
    vector<int> order(n);
    for (int i = 0; i < n; i++) order[i] = i;
    stable_sort(order.begin(), order.end(), [&](int a, int b) {
        return procs[a].at < procs[b].at;
    });

    vector<int> ct(n, 0), tat(n, 0), wt(n, 0);
    int t = 0;
    for (int idx : order) {
        if (t < procs[idx].at) t = procs[idx].at; // CPU idle gap
        t += procs[idx].bt;
        ct[idx] = t;
        tat[idx] = ct[idx] - procs[idx].at;
        wt[idx] = tat[idx] - procs[idx].bt;
    }
    print_result("FCFS (Non-Preemptive)", procs, ct, tat, wt);
}

// 2. SJF (Non-Preemptive) with Arrival Time
void sjf_non_preemptive(const vector<Process> &procs) {
    int n = procs.size();
    vector<int> ct(n, 0), tat(n, 0), wt(n, 0);
    vector<bool> done(n, false);
    int completed = 0, t = 0;

    while (completed < n) {
        int best = -1;
        for (int i = 0; i < n; i++) {
            if (!done[i] && procs[i].at <= t) {
                if (best == -1 || procs[i].bt < procs[best].bt ||
                    (procs[i].bt == procs[best].bt && procs[i].at < procs[best].at)) {
                    best = i;
                }
            }
        }
        if (best == -1) {
            // Jump clock to next arriving process
            int next_at = INT_MAX;
            for (int i = 0; i < n; i++)
                if (!done[i]) next_at = min(next_at, procs[i].at);
            t = next_at;
            continue;
        }
        t += procs[best].bt;
        ct[best] = t;
        tat[best] = ct[best] - procs[best].at;
        wt[best] = tat[best] - procs[best].bt;
        done[best] = true;
        completed++;
    }
    print_result("SJF (Non-Preemptive)", procs, ct, tat, wt);
}

// 3. SRTF (Preemptive SJF) with Arrival Time
void srtf_preemptive(const vector<Process> &procs) {
    int n = procs.size();
    vector<int> rem(n), ct(n, 0), tat(n, 0), wt(n, 0);
    for (int i = 0; i < n; i++) rem[i] = procs[i].bt;

    int completed = 0, t = 0;
    while (completed < n) {
        int best = -1;
        for (int i = 0; i < n; i++) {
            if (rem[i] > 0 && procs[i].at <= t) {
                if (best == -1 || rem[i] < rem[best] ||
                    (rem[i] == rem[best] && procs[i].at < procs[best].at)) {
                    best = i;
                }
            }
        }
        if (best == -1) {
            t++; // CPU idle for 1 unit
            continue;
        }
        rem[best]--;
        t++;
        if (rem[best] == 0) {
            ct[best] = t;
            tat[best] = ct[best] - procs[best].at;
            wt[best] = tat[best] - procs[best].bt;
            completed++;
        }
    }
    print_result("SRTF (Preemptive SJF)", procs, ct, tat, wt);
}

// 4. Priority Scheduling (Non-Preemptive, lower number = higher priority)
void priority_non_preemptive(const vector<Process> &procs) {
    int n = procs.size();
    vector<int> ct(n, 0), tat(n, 0), wt(n, 0);
    vector<bool> done(n, false);
    int completed = 0, t = 0;

    while (completed < n) {
        int best = -1;
        for (int i = 0; i < n; i++) {
            if (!done[i] && procs[i].at <= t) {
                if (best == -1 || procs[i].pr < procs[best].pr ||
                    (procs[i].pr == procs[best].pr && procs[i].at < procs[best].at)) {
                    best = i;
                }
            }
        }
        if (best == -1) {
            int next_at = INT_MAX;
            for (int i = 0; i < n; i++)
                if (!done[i]) next_at = min(next_at, procs[i].at);
            t = next_at;
            continue;
        }
        t += procs[best].bt;
        ct[best] = t;
        tat[best] = ct[best] - procs[best].at;
        wt[best] = tat[best] - procs[best].bt;
        done[best] = true;
        completed++;
    }
    print_result("Priority (Non-Preemptive, low=high)", procs, ct, tat, wt);
}

// 5. Priority Scheduling (Preemptive, lower number = higher priority)
void priority_preemptive(const vector<Process> &procs) {
    int n = procs.size();
    vector<int> rem(n), ct(n, 0), tat(n, 0), wt(n, 0);
    for (int i = 0; i < n; i++) rem[i] = procs[i].bt;

    int completed = 0, t = 0;
    while (completed < n) {
        int best = -1;
        for (int i = 0; i < n; i++) {
            if (rem[i] > 0 && procs[i].at <= t) {
                if (best == -1 || procs[i].pr < procs[best].pr ||
                    (procs[i].pr == procs[best].pr && procs[i].at < procs[best].at)) {
                    best = i;
                }
            }
        }
        if (best == -1) {
            t++;
            continue;
        }
        rem[best]--;
        t++;
        if (rem[best] == 0) {
            ct[best] = t;
            tat[best] = ct[best] - procs[best].at;
            wt[best] = tat[best] - procs[best].bt;
            completed++;
        }
    }
    print_result("Priority (Preemptive, low=high)", procs, ct, tat, wt);
}

// 6. Round Robin (Preemptive) with Arrival Time & Ready Queue
void round_robin(const vector<Process> &procs, int q) {
    int n = procs.size();
    vector<int> order(n);
    for (int i = 0; i < n; i++) order[i] = i;
    stable_sort(order.begin(), order.end(), [&](int a, int b) {
        return procs[a].at < procs[b].at;
    });

    vector<int> rem(n), ct(n, 0), tat(n, 0), wt(n, 0);
    for (int i = 0; i < n; i++) rem[i] = procs[i].bt;

    queue<int> rq;
    int next_idx = 0, completed = 0, t = 0;

    while (completed < n) {
        if (rq.empty()) {
            t = max(t, procs[order[next_idx]].at);
            while (next_idx < n && procs[order[next_idx]].at <= t) {
                rq.push(order[next_idx++]);
            }
        }

        int i = rq.front();
        rq.pop();

        int run = min(rem[i], q);
        rem[i] -= run;
        t += run;

        // Enqueue any processes that arrived during this time slice
        while (next_idx < n && procs[order[next_idx]].at <= t) {
            rq.push(order[next_idx++]);
        }

        if (rem[i] == 0) {
            ct[i] = t;
            tat[i] = ct[i] - procs[i].at;
            wt[i] = tat[i] - procs[i].bt;
            completed++;
        } else {
            rq.push(i); // Re-enqueue at back of ready queue
        }
    }
    print_result("Round Robin (Preemptive, q=" + to_string(q) + ")", procs, ct, tat, wt);
}

int main() {
    int n = read_int("Enter number of processes: ");
    if (n < 1) {
        cout << "Need at least one process.\n";
        return 1;
    }

    vector<Process> procs(n);
    for (int i = 0; i < n; i++) {
        cout << "Enter PID, Arrival Time, Burst Time, Priority (low=high): ";
        while (!(cin >> procs[i].id >> procs[i].at >> procs[i].bt >> procs[i].pr) ||
               procs[i].at < 0 || procs[i].bt <= 0) {
            cin.clear();
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
            cout << "Invalid (AT >= 0, BT > 0). Re-enter PID AT BT PR: ";
        }
    }

    int choice;
    do {
        cout << "\n1:FCFS  2:SJF(NP)  3:SRTF(P)  4:Priority(NP)  5:Priority(P)  6:Round Robin  7:Quit\n";
        choice = read_int("Enter choice: ");
        switch (choice) {
            case 1: fcfs(procs); break;
            case 2: sjf_non_preemptive(procs); break;
            case 3: srtf_preemptive(procs); break;
            case 4: priority_non_preemptive(procs); break;
            case 5: priority_preemptive(procs); break;
            case 6: {
                int q = read_int("Enter time quantum: ");
                while (q < 1) q = read_int("Quantum must be >= 1, re-enter: ");
                round_robin(procs, q);
                break;
            }
            case 7: break;
            default: cout << "Invalid choice.\n"; break;
        }
    } while (choice != 7);

    return 0;
}
