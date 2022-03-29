#include <bits/stdc++.h>
#define int long long
#define abs llabs
#define MAXN 100005
#define INF 1000000000000000000
#define pb push_back
#define mp make_pair
using namespace std;
int n,m,a[MAXN],best=INF;
bool ok(int x){
	int i,ans=0;
	for (i=1;i<=n;i++){
		ans+=x/a[i];
	}
	if (ans>=m) return true;
	return false;
}
void bins(int lo,int hi){
	while (lo<=hi){
		int mid=(lo+hi)/2;
		if (ok(mid)){
			if (best>mid) best=mid;
			hi=mid-1;
		}
		else lo=mid+1;
	}
}
main(){
	//ios::sync_with_stdio(false); cin.tie(0);
	//freopen("inp.txt","r",stdin);	//freopen("out.txt","w",stdout);
	//freopen(".INP","r",stdin); freopen(".OUT","w",stdout);
	cin>>n>>m; int i,j;
	for (i=1;i<=n;i++) cin>>a[i];
	bins(1,1000000000000000000); cout<<best;
}
