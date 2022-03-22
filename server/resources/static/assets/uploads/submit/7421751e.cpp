#include <bits/stdc++.h>
using namespace std;

int a[300000],b[300000], r[300000], c[300000];
long long base = 998244353;
long long power(long long x, long long y)
{
    long long temp;
    if( y == 0)
        return 1;
    temp = power(x, y / 2);
    temp = (temp * temp) % base;
    if (y % 2 == 0)
        return temp;
    else
        return (temp*x) % base;
}

void xuli(){
    int n,m,q;
    long long k;
    long long cnt = 0;
    cin >> n >> m >> k >> q;
    for (int i=1; i<=n; i++) r[i] = 0;
    for (int i=1; i<=m; i++) c[i] = 0;
    for (int i=1; i<=q; i++) cin >> a[i] >> b[i];
    for (int i=q; i>=1; i--){
        if (r[a[i]]==0 || c[b[i]]==0) cnt++;
        r[a[i]]=1;
        c[b[i]]=1;
    }
    cout << power(k, cnt) << endl;
}

int main()
{
    int t;
    cin >> t;
    for (int i=1; i<=t; i++) xuli();
    return 0;
}
