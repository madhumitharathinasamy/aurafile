// imageProcessor.cpp
// Baseline implementation for Wasm-based image/data processing
// Currently exports a basic calculation utility to demonstrate WebAssembly bridging

extern "C" {
    int add(int a, int b) {
        return a + b;
    }

    // Future implementation:
    // void processData(unsigned char* buffer, int length)
}
