import * as coda from "@codahq/packs-sdk";
import { pinyin } from "pinyin-pro";
import { match } from "pinyin-pro";
import { fromPinyin } from "zhuyin"

export const pack = coda.newPack();

pack.addFormula({
  resultType: coda.ValueType.String,
  name: "Pinyin",
  description: "Get the Hanyu Pinyin (漢語拼音) for Chinese characters.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "characters",
      description: "Chinese characters to translate into pinyin.",
    }),
    coda.makeParameter({
	  type: coda.ParameterType.String,
	  name: "toneType",
	  description: "Tone type for each character",
	  optional: true,
	  suggestedValue: "symbol",
	  autocomplete: ["symbol", "number", "none"]
	}),
	coda.makeParameter({
	  type: coda.ParameterType.String,
	  name: "pattern",
	  description: "Different Pinyin patterns",
	  optional: true,
	  suggestedValue: "pinyin",
	  autocomplete: ["pinyin", "first initial", "last initial", "tone"]
	}),
	coda.makeParameter({
	  type: coda.ParameterType.String,
	  name: "removeLetters",
	  description: "Remove non-Chinese characters from output.",
	  optional: true,
	  suggestedValue: true,
	  autocomplete: [true, false]
	}),
  ],

  execute: async function ([characters, toneType, pattern, removeLetters], context) {
    let finalPattern, finalToneType
    if (toneType == "number") { finalToneType = "num" } else { finalToneType = toneType }
    switch (pattern) {
	  case "first initial": finalPattern = 'initial'; break;
	  case "last initial": finalPattern = 'final'; break;
	  case "tone": finalPattern = 'num'; break;	  	  	
	}
    let options = {
      toneType: finalToneType,
 	  pattern: finalPattern,
 	  nonZh: 'consecutive',
    }
    return pinyin(characters, options);
  },
});

pack.addFormula({
  resultType: coda.ValueType.String,
  name: "MatchPinyin",
  description: "Get a list of numbers corresponding to the Chinese character that you accurately enter the Pinyin for.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "characters",
      description: "Chinese characters to match against Pinyin.",
      optional: false
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "pinyin",
      description: "Pinyin to match against the Chinese characters.",
      optional: false
    }),
  ],
  execute: async function ([characters, pinyin], context) {
    return match(characters, pinyin);
  },
});

pack.addFormula({
  resultType: coda.ValueType.String,
  name: "Zhuyin",
  description: "Get the Zhuyin Fuhao (注音符號) from Pinyin.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "pinyin",
      description: "Chinese Pinyin to translate into zhuyin.",
    }),
  ],
  execute: async function ([pinyin], context) {
    return fromPinyin(pinyin);
  },
});
