#include <assert.h>
#include <string>
#include <napi.h>
#include "../lib/levenshtein.cpp"

using namespace Napi;

Value Levenstein(const CallbackInfo& info) {
  assert(info[0].IsString());
  auto word = info[0].As<String>().Utf16Value();
  auto reference = info[1].As<String>().Utf16Value();
  int result = levenshtein(word, reference);
  return Number::New(info.Env(), result);
}

Object Init(Env env, Object exports) {
  exports.Set("levenshtein", Function::New(env, Levenstein));
  return exports;
}

NODE_API_MODULE(addon, Init)
