#include<iostream>
#include<vector>
#include<algorithm>
using namespace std;


void print_result(int p, vector<int> &process , vector<int> &bt, vector<int> &wt , vector<int> &tat){
    float twt =0, ttat = 0;
    cout << "srno \t process id \t burst time \t waiting time \t turnaround time" << endl;

    for(int i=0;i<p;i++){
    cout << i << "\t " << process[i] << " \t  " << bt[i] << "\t   " << wt[i] << "\t   " << tat[i] << endl;
    twt+=wt[i];
    ttat+=tat[i];
    }
    cout << "avg waiting time: " << (twt/p) << endl << "avg turnaround time: " << (ttat/p) << endl;
    

}

void fcfs(int p, vector<int> &process , vector<int> &bt, vector<int> &pr){
    vector<int> tat(p,0), wt(p,0);
    vector<pair<int, int>> gantt;
    for(int i=1;i<p;i++)wt[i] = wt[i-1]+bt[i-1];
    for(int i=0;i<p;i++){
        tat[i] = wt[i] + bt[i];
        gantt.push_back({process[i],tat[i]});
    }
    
    print_result(p,process,bt,wt,tat);

}

void sjf(int p, vector<int> &process , vector<int> &bt, vector<int> &pr){
    vector<pair<int,int>> v;
    vector<int> tat(p), wt(p,0), np(p), nbt(p);
    vector<pair<int, int>> gantt;
    for(int i=0;i<p;i++){
    v.push_back({bt[i],i});
    }

    sort(v.begin(),v.end());
    
    for(int i=0;i<p;i++){
    int index = v[i].second;
    np[i] = process[index];
    nbt[i] = bt[index];
        }

    for(int i=1;i<p;i++)wt[i] = wt[i-1]+nbt[i-1];
    for(int i=0;i<p;i++){
        tat[i] = wt[i] + nbt[i];
        gantt.push_back({np[i],tat[i]});
    }
    
    print_result(p,np,nbt,wt,tat);
}


void pr_sched(int p, vector<int> &process , vector<int> &bt, vector<int> &pr){
    vector<pair<int,int>> v;
    vector<int> tat(p), wt(p,0), np(p), nbt(p);
    vector<pair<int, int>> gantt;
    for(int i=0;i<p;i++)v.push_back({pr[i],i});

    sort(v.begin(),v.end());

    for(int i=0;i<p;i++){
    int index = v[i].second;
    np[i] = process[index];
    nbt[i] = bt[index];
    }

    for(int i=1;i<p;i++)wt[i] = wt[i-1]+nbt[i-1];
    for(int i=0;i<p;i++){
        tat[i] = wt[i] + nbt[i];
        gantt.push_back({np[i],tat[i]});
    }
    
    print_result(p,np,nbt,wt,tat);
    }

void round_robin(int p, vector<int> &process , vector<int> &bt, vector<int> &pr, int q){
    int count = 0;
    vector<int> rem = bt;
    vector<int> tat(p), wt(p,0);
    int t=0;

    while(count < p){
        for(int i=0;i<p;i++){
            if(rem[i] > q){
                rem[i] = rem[i] - q;
                t+= q ;                   
                }
            else{
                t+=rem[i];
                tat[i] = t;
                wt[i] = t - bt[i];
                rem[i] = 0;
                count++;
                    }

            }

    }

    print_result(p,process,bt,wt,tat);

}

int main(){
    cout << "enter number of process: ";
    int p;
    cin >> p;
    vector<int> process(p);
    vector<int> bt (p);
    vector<int> pr(p);

    for(int i=0;i<p;i++){
    cout << "enter proccess id , burst time and priority: ";
    cin >> process[i] >> bt[i] >> pr[i];
}
     int x ;
    do{
 
    cout << "enter choice : 1:fcfs 2:sjf 3:priority wise 4:round robin 5:quit";
    cin >> x;

    switch(x){
    case 1: fcfs(p,process,bt,pr); break;
    case 2: sjf(p,process,bt,pr); break;
    case 3: pr_sched(p,process,bt,pr); break;
    case 4: 
    int q;
    cout << "enter qunatam: ";
    cin >> q;
    round_robin(p,process,bt,pr,q); break;
    
        }


    }while(x!=5);
return 0;

}
