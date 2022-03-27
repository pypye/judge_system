#include <windows.h>
#include <stdio.h>
#include <psapi.h>
#include <string>
#include <chrono>
#include <future>

using namespace std::chrono;
using namespace std;
int timeUsage = 0;
int memoryUsage = 0;

DWORD getExitCode(HANDLE &hProcess){
    DWORD exitCode = 0;
    GetExitCodeProcess(hProcess, &exitCode);
    return exitCode;
}

int getCurrentMemoryUsage(HANDLE &hProcess){
    PROCESS_MEMORY_COUNTERS pmc;
    int currentMemoryUsage = 0;
    if (!GetProcessMemoryInfo(hProcess, &pmc, sizeof(pmc))) return 0;
    currentMemoryUsage = pmc.PeakWorkingSetSize >> 10;
    if (currentMemoryUsage < 0) currentMemoryUsage = INT_MAX >> 10;
    return currentMemoryUsage;
}

int getMaxMemoryUsage(PROCESS_INFORMATION &processInfo, int memoryLimit){
    int maxMemoryUsage = 0, currentMemoryUsage = 0;
    do {
        currentMemoryUsage = getCurrentMemoryUsage(processInfo.hProcess);
        if (currentMemoryUsage > maxMemoryUsage) maxMemoryUsage = currentMemoryUsage;
        if (memoryLimit != 0 && currentMemoryUsage > memoryLimit) {
            TerminateProcess(processInfo.hProcess, -2);
        }
    } while (getExitCode(processInfo.hProcess) == STILL_ACTIVE);
    memoryUsage = min(max(memoryUsage, maxMemoryUsage), memoryLimit);
    return maxMemoryUsage;
}

DWORD runProcess(PROCESS_INFORMATION &processInfo, int timeLimit, int memoryLimit){
    auto feature = async(launch::async, getMaxMemoryUsage, ref(processInfo), memoryLimit);
    ResumeThread(processInfo.hThread);

    auto startTime = high_resolution_clock().now();
    WaitForSingleObject(processInfo.hProcess, timeLimit);
    auto endTime = high_resolution_clock().now();
    timeUsage = duration_cast<milliseconds>(endTime - startTime).count();
    timeUsage = min(timeUsage, timeLimit);

    if (getExitCode(processInfo.hProcess) == STILL_ACTIVE) {
        TerminateProcess(processInfo.hProcess, -1);
    }
    return getExitCode(processInfo.hProcess);
}

DWORD createProcess(PROCESS_INFORMATION &processInfo, STARTUPINFOA &startupInfo, string argv, HANDLE &hInput, HANDLE &hOutput){
    ZeroMemory(&processInfo, sizeof(processInfo));
    ZeroMemory(&startupInfo, sizeof(startupInfo));
    startupInfo.cb = sizeof(startupInfo);
    if (hInput != NULL || hOutput != NULL) startupInfo.dwFlags |= STARTF_USESTDHANDLES;
    if (hInput != NULL) startupInfo.hStdInput = hInput;
    if (hOutput != NULL) {
        startupInfo.hStdError = hOutput;
        startupInfo.hStdOutput = hOutput;
    }
    char *cstr = new char[argv.length() + 1];
    strcpy(cstr, argv.c_str());
    if (!CreateProcessA(NULL, cstr, NULL, NULL, TRUE, 0, NULL, NULL, &startupInfo, &processInfo)) return GetLastError();
    return 0;
}

DWORD prepare(int argc, char *argv[], string &command, HANDLE &hInput, HANDLE &hOutput, int &timeLimit, int &memoryLimit){
    SECURITY_ATTRIBUTES sa;
    sa.nLength = sizeof(sa);
    sa.lpSecurityDescriptor = NULL;
    sa.bInheritHandle = TRUE;
    for (int i = 1; i < argc; i++){
        if (!strcmp(argv[i], "-t")) timeLimit = stoi(argv[i + 1]);
        if (!strcmp(argv[i], "-m")) memoryLimit = stoi(argv[i + 1]) * 1024;
        if (string(argv[i]).find(".exe") != -1) command = argv[i];
        if (!strcmp(argv[i], "-i")){
            hInput = CreateFileA(argv[i + 1], GENERIC_READ, 0, &sa, OPEN_EXISTING, FILE_ATTRIBUTE_READONLY, NULL);
            if (hInput == INVALID_HANDLE_VALUE) return (LONG_PTR)-1;
        }
        if (!strcmp(argv[i], "-o")) {
            hOutput = CreateFileA(argv[i + 1], GENERIC_WRITE, 0, &sa, CREATE_ALWAYS, FILE_ATTRIBUTE_NORMAL, NULL);
            if (hOutput == INVALID_HANDLE_VALUE) return (LONG_PTR)-1;
        }
    }
    return 0;
}

int main(int argc, char *argv[]){
    STARTUPINFOA startupInfo;
    PROCESS_INFORMATION processInfo;
    DWORD exitCode;
    HANDLE hInput = NULL;
    HANDLE hOutput = NULL;
    int timeLimit = 1000, memoryLimit = 256 * 1024;
    string command;
    exitCode = prepare(argc, argv, command, hInput, hOutput, timeLimit, memoryLimit);
    if (exitCode) {
        printf("{\"time\": %d, \"memory\": %d}", timeUsage, memoryUsage / 1024);
        return exitCode;
    }

    exitCode = createProcess(processInfo, startupInfo, command, hInput, hOutput);
    if (exitCode) {
        printf("{\"time\": %d, \"memory\": %d}", timeUsage, memoryUsage / 1024);
        return exitCode;
    }

    exitCode = runProcess(processInfo, timeLimit, memoryLimit);
    if (exitCode) {
        printf("{\"time\": %d, \"memory\": %d}", timeUsage, memoryUsage / 1024);
        return exitCode;
    }

    printf("{\"time\": %d, \"memory\": %d}", timeUsage, memoryUsage / 1024);
    return exitCode;
}