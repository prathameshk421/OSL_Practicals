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

// Helper: returns indices of all processes currently in the ready queue at time t
vector<int> get_ready(const vector<Process> &p, const vector<int> &rem, int t) {
    vector<int> ready;
    for (int i = 0; i < (int)p.size(); i++) {
        if (p[i].at <= t && rem[i] > 0) {
            ready.push_back(i);
        }
    }
    return ready;
}

// 1. FCFS (Non-Preemptive) — Clock Loop + Ready Queue
void fcfs(const vector<Process> &p) {
    int n = p.size();
    vector<int> rem(n), ct(n, 0), tat(n, 0), wt(n, 0);
    for (int i = 0; i < n; i++) rem[i] = p[i].bt;

    int completed = 0, curr = -1;
    for (int t = 0; completed < n; t++) {
        if (curr == -1) {
            vector<int> ready = get_ready(p, rem, t);
            for (int i : ready) {
                if (curr == -1 || p[i].at < p[curr].at) curr = i;
            }
        }
        if (curr == -1) continue; // CPU idle

        rem[curr]--;
        if (rem[curr] == 0) {
            ct[curr] = t + 1;
            tat[curr] = ct[curr] - p[curr].at;
            wt[curr] = tat[curr] - p[curr].bt;
            completed++;
            curr = -1;
        }
    }
    print_result("FCFS (Non-Preemptive)", p, ct, tat, wt);
}

// 2. SJF (Non-Preemptive) — Clock Loop + Ready Queue
void sjf(const vector<Process> &p) {
    int n = p.size();
    vector<int> rem(n), ct(n, 0), tat(n, 0), wt(n, 0);
    for (int i = 0; i < n; i++) rem[i] = p[i].bt;

    int completed = 0, curr = -1;
    for (int t = 0; completed < n; t++) {
        if (curr == -1) {
            vector<int> ready = get_ready(p, rem, t);
            for (int i : ready) {
                if (curr == -1 || p[i].bt < p[curr].bt ||
                    (p[i].bt == p[curr].bt && p[i].at < p[curr].at)) {
                    curr = i;
                }
            }
        }
        if (curr == -1) continue;

        rem[curr]--;
        if (rem[curr] == 0) {
            ct[curr] = t + 1;
            tat[curr] = ct[curr] - p[curr].at;
            wt[curr] = tat[curr] - p[curr].bt;
            completed++;
            curr = -1;
        }
    }
    print_result("SJF (Non-Preemptive)", p, ct, tat, wt);
}

// 3. SRTF (Preemptive SJF) — Re-check Ready Queue Every Tick!
void srtf(const vector<Process> &p) {
    int n = p.size();
    vector<int> rem(n), ct(n, 0), tat(n, 0), wt(n, 0);
    for (int i = 0; i < n; i++) rem[i] = p[i].bt;

    int completed = 0;
    for (int t = 0; completed < n; t++) {
        vector<int> ready = get_ready(p, rem, t);
        int curr = -1;
        for (int i : ready) {
            if (curr == -1 || rem[i] < rem[curr] ||
                (rem[i] == rem[curr] && p[i].at < p[curr].at)) {
                curr = i;
            }
        }
        if (curr == -1) continue;

        rem[curr]--;
        if (rem[curr] == 0) {
            ct[curr] = t + 1;
            tat[curr] = ct[curr] - p[curr].at;
            wt[curr] = tat[curr] - p[curr].bt;
            completed++;
        }
    }
    print_result("SRTF (Preemptive SJF)", p, ct, tat, wt);
}

// 4. Priority (Non-Preemptive, low=high) — Clock Loop + Ready Queue
void priority_np(const vector<Process> &p) {
    int n = p.size();
    vector<int> rem(n), ct(n, 0), tat(n, 0), wt(n, 0);
    for (int i = 0; i < n; i++) rem[i] = p[i].bt;

    int completed = 0, curr = -1;
    for (int t = 0; completed < n; t++) {
        if (curr == -1) {
            vector<int> ready = get_ready(p, rem, t);
            for (int i : ready) {
                if (curr == -1 || p[i].pr < p[curr].pr ||
                    (p[i].pr == p[curr].pr && p[i].at < p[curr].at)) {
                    curr = i;
                }
            }
        }
        if (curr == -1) continue;

        rem[curr]--;
        if (rem[curr] == 0) {
            ct[curr] = t + 1;
            tat[curr] = ct[curr] - p[curr].at;
            wt[curr] = tat[curr] - p[curr].bt;
            completed++;
            curr = -1;
        }
    }
    print_result("Priority (Non-Preemptive, low=high)", p, ct, tat, wt);
}

// 5. Priority (Preemptive, low=high) — Re-check Ready Queue Every Tick!
void priority_p(const vector<Process> &p) {
    int n = p.size();
    vector<int> rem(n), ct(n, 0), tat(n, 0), wt(n, 0);
    for (int i = 0; i < n; i++) rem[i] = p[i].bt;

    int completed = 0;
    for (int t = 0; completed < n; t++) {
        vector<int> ready = get_ready(p, rem, t);
        int curr = -1;
        for (int i : ready) {
            if (curr == -1 || p[i].pr < p[curr].pr ||
                (p[i].pr == p[curr].pr && p[i].at < p[curr].at)) {
                curr = i;
            }
        }
        if (curr == -1) continue;

        rem[curr]--;
        if (rem[curr] == 0) {
            ct[curr] = t + 1;
            tat[curr] = ct[curr] - p[curr].at;
            wt[curr] = tat[curr] - p[curr].bt;
            completed++;
        }
    }
    print_result("Priority (Preemptive, low=high)", p, ct, tat, wt);
}

// 6. Round Robin (Preemptive) — Clock Loop + FIFO Ready Queue
void round_robin(const vector<Process> &p, int time_q) {
    int n = p.size();
    vector<int> rem(n), ct(n, 0), tat(n, 0), wt(n, 0);
    for (int i = 0; i < n; i++) rem[i] = p[i].bt;

    queue<int> rq;
    int completed = 0, curr = -1, slice = 0;

    for (int t = 0; completed < n; t++) {
        // 1. Add processes arriving at time t into ready queue
        for (int i = 0; i < n; i++) {
            if (p[i].at == t) rq.push(i);
        }

        // 2. If previous process finished its quantum, push it to the back
        if (curr != -1 && slice == time_q) {
            rq.push(curr);
            curr = -1;
            slice = 0;
        }

        // 3. If CPU is free, take next process from ready queue
        if (curr == -1 && !rq.empty()) {
            curr = rq.front();
            rq.pop();
            slice = 0;
        }

        if (curr == -1) continue; // CPU idle

        // 4. Execute for 1 tick
        rem[curr]--;
        slice++;
        if (rem[curr] == 0) {
            ct[curr] = t + 1;
            tat[curr] = ct[curr] - p[curr].at;
            wt[curr] = tat[curr] - p[curr].bt;
            completed++;
            curr = -1;
            slice = 0;
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
