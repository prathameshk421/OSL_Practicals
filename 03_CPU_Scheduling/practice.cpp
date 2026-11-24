#include "bits/stdc++.h"
using namespace std;

void print_result(vector<int> &process, vector<int> &bt, vector<int> &wt, vector<int> &tat){
    float twt = 0, ttat = 0;
    int p = process.size();
    cout << "srno \t process id \t burst time \t waiting time \t turnaround time" << endl;

    for(int i=0;i<p;i++){
        cout << i << "\t " << process[i] << " \t  " << bt[i] << "\t   " << wt[i] << "\t   " << tat[i] << endl;
        twt += wt[i];
        ttat += tat[i];
    }
    cout << "avg waiting time: " << (twt/p) << endl << "avg turnaround time: " << (ttat/p) << endl;
}

void fcfs(vector<int> &process,vector<int> &bt){
    int n=process.size();
    vector<int> tat(n,0),wt(n,0);

    for(int i=1;i<n;i++)wt[i]=wt[i-1]+bt[i-1];
    for(int i=0;i<n;i++)tat[i]=bt[i]+wt[i];

    print_result(process,bt,wt,tat);
}

void sjf(vector<int> process,vector<int> bt){
    vector<pair<int,int>> v;
    int n=process.size();
    for(int i=0;i<n;i++)v.push_back({bt[i],process[i]});
    stable_sort(v.begin(),v.end());
    vector<int> tat(n,0);
    vector<int> wt(n,0);
    for(int i=0;i<n;i++){
        process[i]=v[i].second;
        bt[i]=v[i].first;
    }
    for(int i=1;i<n;i++)wt[i]=wt[i-1]+bt[i-1];
    for(int i=0;i<n;i++)tat[i]=bt[i]+wt[i];

    print_result(process,bt,wt,tat);
}

void round_robin(vector<int> process,vector<int> bt, int time_q){
    int n=process.size();
    int done=0;
    int cur_t=0;
    vector<int> wt(n,0),tat(n,0);
    vector<int> nbt(bt);
    while(done!=n){
        for(int i=0;i<n;i++){
            if(!nbt[i])continue;
            cur_t+=min(time_q,nbt[i]);
            tat[i]=cur_t;
            nbt[i]-=min(nbt[i],time_q);
            done+=(nbt[i]==0); 
        }
    }
    for(int i=0;i<n;i++)wt[i]=tat[i]-bt[i];
    print_result(process,bt,wt,tat);
} 
int main(){
    int n, time_q;
    cout << "Enter number of processes: ";
    cin >> n;

    vector<int> process(n), bt(n);
    for(int i = 0; i < n; i++){
        process[i] = i + 1;
        cout << "Enter burst time for P" << process[i] << ": ";
        cin >> bt[i];
    }

    cout << "Enter time quantum for Round Robin: ";
    cin >> time_q;

    cout << "\n--- FCFS ---\n";
    fcfs(process, bt);

    cout << "\n--- SJF ---\n";
    sjf(process, bt);

    cout << "\n--- Round Robin ---\n";
    round_robin(process, bt, time_q);

    return 0;
}