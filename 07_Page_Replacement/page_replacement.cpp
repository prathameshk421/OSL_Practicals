#include <bits/stdc++.h>
using namespace std;

void show(vector<int> &f){
    cout<<" Frames: ";
    for(int i=0;i<(int)f.size();i++){
        if(f[i]==-1) cout<<"- ";
        else cout<<f[i]<<' ';
    }
    cout<<'\n';
}

int fifo(vector<int> &ref,int n,int frames){
    cout<<"\nFIFO\n";
    vector<int> f(frames,-1);
    int ptr=0;
    int faults=0;
    for(int i=0;i<n;i++){
        int hit=0;
        for(int j=0;j<frames;j++){
            if(f[j]==ref[i]) hit=1;
        }
        if(hit){
            cout<<"Ref "<<ref[i]<<" -> hit  ";
        }
        else{
            f[ptr]=ref[i];
            ptr=(ptr+1)%frames;
            faults++;
            cout<<"Ref "<<ref[i]<<" -> FAULT";
        }
        show(f);
    }
    return faults;
}

int lru(vector<int> &ref,int n,int frames){
    cout<<"\nLRU\n";
    vector<int> f(frames,-1);
    vector<int> last(frames,-1);
    int faults=0;
    for(int i=0;i<n;i++){
        int hit=-1;
        for(int j=0;j<frames;j++){
            if(f[j]==ref[i]) hit=j;
        }
        if(hit==-1){
            int victim=0;
            for(int j=1;j<frames;j++){
                if(last[j]<last[victim]) victim=j;
            }
            f[victim]=ref[i];
            last[victim]=i;
            faults++;
            cout<<"Ref "<<ref[i]<<" -> FAULT";
        }
        else{
            last[hit]=i;
            cout<<"Ref "<<ref[i]<<" -> hit  ";
        }
        show(f);
    }
    return faults;
}

int optimal(vector<int> &ref,int n,int frames){
    cout<<"\nOptimal\n";
    vector<int> f(frames,-1);
    int faults=0;
    for(int i=0;i<n;i++){
        int hit=0;
        for(int j=0;j<frames;j++){
            if(f[j]==ref[i]) hit=1;
        }
        if(hit){
            cout<<"Ref "<<ref[i]<<" -> hit  ";
            show(f);
            continue;
        }
        int victim=-1;
        int farthest=-1;
        for(int j=0;j<frames;j++){
            if(f[j]==-1){
                victim=j;
                break;
            }
            int k=i+1;
            while(k<n && ref[k]!=f[j]) k++;
            if(k>farthest){
                farthest=k;
                victim=j;
            }
        }
        f[victim]=ref[i];
        faults++;
        cout<<"Ref "<<ref[i]<<" -> FAULT";
        show(f);
    }
    return faults;
}

int main()
{
    int n, frames;

    cout << "Enter number of page references: ";
    cin >> n;

    vector<int> ref(n);

    cout << "Enter reference string: ";
    for(int i = 0; i < n; i++) {
        cin >> ref[i];
    }

    cout << "Enter number of frames: ";
    cin >> frames;

    cout << "\nReference String: ";
    for(int i = 0; i < n; i++) {
        cout << ref[i] << ' ';
    }
    cout << "\nNumber of Frames: " << frames << '\n';

    int faults = fifo(ref, n, frames);
    cout << "\nTotal Page Faults (FIFO): " << faults << '\n';

    faults = lru(ref, n, frames);
    cout << "\nTotal Page Faults (LRU): " << faults << '\n';

    faults = optimal(ref, n, frames);
    cout << "\nTotal Page Faults (Optimal): " << faults << '\n';

    return 0;
}
