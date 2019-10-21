{
  "targets": [
    {
      "target_name": "binding",
	  "include_dirs": ["<!@(node -p \"require('node-addon-api').include\")"],
	  "dependencies": ["<!(node -p \"require('node-addon-api').gyp\")"],
	  "defines": [ "NAPI_DISABLE_CPP_EXCEPTIONS" ],
      "sources": ["src/node.cpp"],
    "cflags_cc": ["-std=c++17"]         
    }
  ]
}
