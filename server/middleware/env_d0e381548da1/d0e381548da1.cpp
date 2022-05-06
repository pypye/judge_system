#include <bits/stdc++.h>
#define FOR(i, a, b) for(int i = a; i <= b; i++)
#define FORR(i, a, b) for(int i = a; i >= b; i--)
#define maxn 100005
using namespace std;
int n, m, t[maxn], res;
bool check(long long u)
{
    long long sum = 0;
    FOR(i, 1, n) sum += u / t[i];
    return (sum >= m);
}
int main()
{
    //freopen("application.inp", "r", stdin);
    scanf("%d%d", &n, &m);
    FOR(i, 1, n) scanf("%d", &t[i]);
    long long mm = *max_element(t+1, t+n+1);
    long long l = 0, r = mm * m;
    while (r - l > 1)
    {
        long long mid = (l + r) >> 1;
        if(check(mid)) r = mid;
        else l = mid;
    }
    printf("%lld", r);
}
