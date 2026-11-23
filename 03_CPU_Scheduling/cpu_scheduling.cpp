#include <bits/stdc++.h>
using namespace std;

int read_int(const string &prompt){
    int x;
    while(true){
        cout << prompt;
        if(cin >> x) return x;
        cin.clear();
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
        cout << "invalid input\n";
    }
}

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

void fcfs(vector<int> &process, vector<int> &bt){
    int p = process.size();
    vector<int> wt(p,0), tat(p,0);
    for(int i=1;i<p;i++) wt[i] = wt[i-1] + bt[i-1];
    for(int i=0;i<p;i++) tat[i] = wt[i] + bt[i];
    print_result(process,bt,wt,tat);
}

void sjf(vector<int> &process, vector<int> &bt){
    int p = process.size();
    vector<int> np(p), nbt(p), wt(p,0), tat(p);
    vector<pair<int,int>> v;
    for(int i=0;i<p;i++) v.push_back({bt[i],i});

    stable_sort(v.begin(),v.end());

    for(int i=0;i<p;i++){
        int index = v[i].second;
        np[i] = process[index];
        nbt[i] = bt[index];
    }

    for(int i=1;i<p;i++) wt[i] = wt[i-1] + nbt[i-1];
    for(int i=0;i<p;i++) tat[i] = wt[i] + nbt[i];

    print_result(np,nbt,wt,tat);
}

void pr_sched(vector<int> &process, vector<int> &bt, vector<int> &pr){
    int p = process.size();
    vector<int> np(p), nbt(p), wt(p,0), tat(p);
    vector<pair<int,int>> v;
    for(int i=0;i<p;i++) v.push_back({pr[i],i});

    stable_sort(v.begin(),v.end());

    for(int i=0;i<p;i++){
        int index = v[i].second;
        np[i] = process[index];
        nbt[i] = bt[index];
    }

    for(int i=1;i<p;i++) wt[i] = wt[i-1] + nbt[i-1];
    for(int i=0;i<p;i++) tat[i] = wt[i] + nbt[i];

    print_result(np,nbt,wt,tat);
}

void round_robin(vector<int> &process, vector<int> &bt, int q){
    int p = process.size();
    vector<int> rem = bt, wt(p,0), tat(p,0);
    int done = 0, t = 0;

    while(done < p){
        int did_work = 0;
        for(int i=0;i<p;i++){
            if(rem[i] <= 0) continue;
            did_work = 1;
            int run = min(rem[i],q);
            t += run;
            rem[i] -= run;
            if(rem[i] == 0){
                tat[i] = t;
                wt[i] = t - bt[i];
                done++;
            }
        }
        if(!did_work) break;
    }

    print_result(process,bt,wt,tat);
}

int main(){
    int p = read_int("enter number of process: ");
    if(p < 1){
        cout << "need at least one process\n";
        return 1;
    }

    vector<int> process(p), bt(p), pr(p);
    for(int i=0;i<p;i++){
        cout << "enter proccess id , burst time and priority: ";
        while(!(cin >> process[i] >> bt[i] >> pr[i])){
            cin.clear();
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
            cout << "invalid input\nenter proccess id , burst time and priority: ";
        }
        while(bt[i] < 0){
            bt[i] = read_int("burst time cannot be negative, re-enter: ");
        }
    }

    int x;
    do{
        cout << endl;
        x = read_int("enter choice : 1:fcfs 2:sjf 3:priority wise 4:round robin 5:quit : ");

        switch(x){
        case 1: fcfs(process,bt); break;
        case 2: sjf(process,bt); break;
        case 3: pr_sched(process,bt,pr); break;
        case 4: {
            int q = read_int("enter qunatam: ");
            while(q < 1){
                q = read_int("qunatam must be positive, re-enter: ");
            }
            round_robin(process,bt,q);
            break;
        }
        case 5: break;
        default: cout << "invalid choice\n"; break;
        }
    }while(x != 5);

    return 0;
}
