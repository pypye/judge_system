#include<bits/stdc++.h>
using namespace std;
long long n,m,a[1000006];
bool check(long long x)
{
    long long cnt=0;
    for(long long i=1;i<=n;i++)
        cnt+=x/a[i];
    return cnt>=m;
}
long long aa(long long i,long long j)
{
    while(j-i>1)
    {
        long long l=(i+j)/2;

        if(check(l)) j=l;
        else i=l;
    }

    if(check(i)) return i;
        else return j;
}
int main()
{
    ios_base::sync_with_stdio(0);
    cin.tie(0);
    cout.tie(0);
    //freopen("aa.inp","r",stdin);
   // freopen("aa.out","w",stdout);
    cin>>n>>m;
    for(long long i=1;i<=n;i++)   cin>>a[i];
    cout<<aa(0,a[1]*m);
    return 0;
}
