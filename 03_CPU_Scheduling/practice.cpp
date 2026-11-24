#include <algorithm>
#include <climits>
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
    cout << "Avg Waiting Time: " << (twt / n)
         << "\nAvg Turnaround Time: " << (ttat / n) << "\n";
}

// 1. FCFS (Non-Preemptive) with Arrival Time
void fcfs(const vector<Process> &p) {
    int n = p.size();
    vector<int> order(n);
    for (int i = 0; i < n; i++) order[i] = i;
    stable_sort(order.begin(), order.end(), [&](int a, int b) {
        return p[a].at < p[b].at;
    });

    vector<int> ct(n, 0), tat(n, 0), wt(n, 0);
    int cur_t = 0;
    for (int idx : order) {
        if (cur_t < p[idx].at) cur_t = p[idx].at;
        cur_t += p[idx].bt;
        ct[idx] = cur_t;
        tat[idx] = ct[idx] - p[idx].at;
        wt[idx] = tat[idx] - p[idx].bt;
    }
    print_result("FCFS (Non-Preemptive)", p, ct, tat, wt);
}

// 2. SJF (Non-Preemptive) with Arrival Time
void sjf(const vector<Process> &p) {
    int n = p.size();
    vector<int> ct(n, 0), tat(n, 0), wt(n, 0);
    vector<bool> done(n, false);
    int completed = 0, cur_t = 0;

    while (completed < n) {
        int best = -1;
        for (int i = 0; i < n; i++) {
            if (!done[i] && p[i].at <= cur_t) {
                if (best == -1 || p[i].bt < p[best].bt ||
                    (p[i].bt == p[best].bt && p[i].at < p[best].at)) {
                    best = i;
                }
            }
        }
        if (best == -1) {
            int next_at = INT_MAX;
            for (int i = 0; i < n; i++)
                if (!done[i]) next_at = min(next_at, p[i].at);
            cur_t = next_at;
            continue;
        }
        cur_t += p[best].bt;
        ct[best] = cur_t;
        tat[best] = ct[best] - p[best].at;
        wt[best] = tat[best] - p[best].bt;
        done[best] = true;
        completed++;
    }
    print_result("SJF (Non-Preemptive)", p, ct, tat, wt);
}

// 3. SRTF (Preemptive SJF) with Arrival Time
void srtf(const vector<Process> &p) {
    int n = p.size();
    vector<int> rem(n), ct(n, 0), tat(n, 0), wt(n, 0);
    for (int i = 0; i < n; i++) rem[i] = p[i].bt;

    int completed = 0, cur_t = 0;
    while (completed < n) {
        int best = -1;
        for (int i = 0; i < n; i++) {
            if (rem[i] > 0 && p[i].at <= cur_t) {
                if (best == -1 || rem[i] < rem[best] ||
                    (rem[i] == rem[best] && p[i].at < p[best].at)) {
                    best = i;
                }
            }
        }
        if (best == -1) {
            cur_t++;
            continue;
        }
        rem[best]--;
        cur_t++;
        if (rem[best] == 0) {
            ct[best] = cur_t;
            tat[best] = ct[best] - p[best].at;
            wt[best] = tat[best] - p[best].bt;
            completed++;
        }
    }
    print_result("SRTF (Preemptive SJF)", p, ct, tat, wt);
}

// 4. Priority (Non-Preemptive, lower number = higher priority)
void priority_np(const vector<Process> &p) {
    int n = p.size();
    vector<int> ct(n, 0), tat(n, 0), wt(n, 0);
    vector<bool> done(n, false);
    int completed = 0, cur_t = 0;

    while (completed < n) {
        int best = -1;
        for (int i = 0; i < n; i++) {
            if (!done[i] && p[i].at <= cur_t) {
                if (best == -1 || p[i].pr < p[best].pr ||
                    (p[i].pr == p[best].pr && p[i].at < p[best].at)) {
                    best = i;
                }
            }
        }
        if (best == -1) {
            int next_at = INT_MAX;
            for (int i = 0; i < n; i++)
                if (!done[i]) next_at = min(next_at, p[i].at);
            cur_t = next_at;
            continue;
        }
        cur_t += p[best].bt;
        ct[best] = cur_t;
        tat[best] = ct[best] - p[best].at;
        wt[best] = tat[best] - p[best].bt;
        done[best] = true;
        completed++;
    }
    print_result("Priority (Non-Preemptive, low=high)", p, ct, tat, wt);
}

// 5. Priority (Preemptive, lower number = higher priority)
void priority_p(const vector<Process> &p) {
    int n = p.size();
    vector<int> rem(n), ct(n, 0), tat(n, 0), wt(n, 0);
    for (int i = 0; i < n; i++) rem[i] = p[i].bt;

    int completed = 0, cur_t = 0;
    while (completed < n) {
        int best = -1;
        for (int i = 0; i < n; i++) {
            if (rem[i] > 0 && p[i].at <= cur_t) {
                if (best == -1 || p[i].pr < p[best].pr ||
                    (p[i].pr == p[best].pr && p[i].at < p[best].at)) {
                    best = i;
                }
            }
        }
        if (best == -1) {
            cur_t++;
            continue;
        }
        rem[best]--;
        cur_t++;
        if (rem[best] == 0) {
            ct[best] = cur_t;
            tat[best] = ct[best] - p[best].at;
            wt[best] = tat[best] - p[best].bt;
            completed++;
        }
    }
    print_result("Priority (Preemptive, low=high)", p, ct, tat, wt);
}

// 6. Round Robin (Preemptive) with Arrival Time & Ready Queue
void round_robin(const vector<Process> &p, int time_q) {
    int n = p.size();
    vector<int> order(n);
    for (int i = 0; i < n; i++) order[i] = i;
    stable_sort(order.begin(), order.end(), [&](int a, int b) {
        return p[a].at < p[b].at;
    });

    vector<int> rem(n), ct(n, 0), tat(n, 0), wt(n, 0);
    for (int i = 0; i < n; i++) rem[i] = p[i].bt;

    queue<int> rq;
    int next_idx = 0, completed = 0, cur_t = 0;

    while (completed < n) {
        if (rq.empty()) {
            cur_t = max(cur_t, p[order[next_idx]].at);
            while (next_idx < n && p[order[next_idx]].at <= cur_t)
                rq.push(order[next_idx++]);
        }

        int i = rq.front();
        rq.pop();

        int run = min(time_q, rem[i]);
        rem[i] -= run;
        cur_t += run;

        while (next_idx < n && p[order[next_idx]].at <= cur_t)
            rq.push(order[next_idx++]);

        if (rem[i] == 0) {
            ct[i] = cur_t;
            tat[i] = ct[i] - p[i].at;
            wt[i] = tat[i] - p[i].bt;
            completed++;
        } else {
            rq.push(i);
        }
    }
    print_result("Round Robin (q=" + to_string(time_q) + ")", p, ct, tat, wt);
}

int main() {
    int n, time_q;
    cout << "Enter number of processes: ";
    cin >> n;

    vector<Process> p(n);
    for (int i = 0; i < n; i++) {
        p[i].id = i + 1;
        cout << "Enter Arrival Time, Burst Time, Priority for P" << p[i].id << ": ";
        cin >> p[i].at >> p[i].bt >> p[i].pr;
    }

    cout << "Enter time quantum for Round Robin: ";
    cin >> time_q;

    fcfs(p);
    sjf(p);
    srtf(p);
    priority_np(p);
    priority_p(p);
    round_robin(p, time_q);

    return 0;
}
